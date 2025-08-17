/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseDeclarativeTool,
  BaseToolInvocation,
  Kind,
  ToolEditConfirmationDetails,
  ToolConfirmationOutcome,
  ToolResult,
} from './tools.js';
import { FunctionDeclaration } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';
import { homedir } from 'os';
import * as Diff from 'diff';
import { DEFAULT_DIFF_OPTIONS } from './diffOptions.js';
import { tildeifyPath } from '../utils/paths.js';
import { ModifiableDeclarativeTool, ModifyContext } from './modifiable-tool.js';
import { SchemaValidator } from '../utils/schemaValidator.js';

const memoryToolSchemaData: FunctionDeclaration = {
  name: 'save_memory',
  description:
    'Saves a permanent, immutable instruction for long-term memory. Use for general, lasting guidelines that shape behavior across all future sessions. Not for temporary or project-specific details; use memory for those.',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      instruction: {
        type: 'string',
        description:
          'The specific instruction to remember. Should be a clear, self-contained statement.',
      },
    },
    required: ['instruction'],
  },
};

const memoryToolDescription = `
Saves a permanent, immutable instruction for long-term memory.

Use this tool:

- For general, lasting guidelines that shape your behavior or interaction style across all future sessions.
- When the user explicitly asks you to remember something permanently (e.g., "Always Always ask for permission before executing a command.").

Do NOT use this tool:

- For temporary or project-specific details; use memory tools ('add_memory', 'search_memory', 'delete_memory') for those.
- To store conversational context.
- To save long, complex, or rambling texts.

## Parameters

- \`instruction\` (string, required): The specific, concise instruction to remember permanently.
`;

export const GEMINI_CONFIG_DIR = '.gemini';
export const DEFAULT_CONTEXT_FILENAME = 'GEMINI.md';
export const INSTRUCTION_SECTION_HEADER = '## Gemini Added Instructions';

const MEMORY_SECTION_HEADER = INSTRUCTION_SECTION_HEADER;

// This variable will hold the currently configured filename for GEMINI.md context files.
// It defaults to DEFAULT_CONTEXT_FILENAME but can be overridden by setGeminiMdFilename.
let currentGeminiMdFilename: string | string[] = DEFAULT_CONTEXT_FILENAME;

export function setGeminiMdFilename(newFilename: string | string[]): void {
  if (Array.isArray(newFilename)) {
    if (newFilename.length > 0) {
      currentGeminiMdFilename = newFilename.map((name) => name.trim());
    }
  } else if (newFilename && newFilename.trim() !== '') {
    currentGeminiMdFilename = newFilename.trim();
  }
}

export function getCurrentGeminiMdFilename(): string {
  if (Array.isArray(currentGeminiMdFilename)) {
    return currentGeminiMdFilename[0];
  }
  return currentGeminiMdFilename;
}

export function getAllGeminiMdFilenames(): string[] {
  if (Array.isArray(currentGeminiMdFilename)) {
    return currentGeminiMdFilename;
  }
  return [currentGeminiMdFilename];
}

interface SaveMemoryParams {
  instruction: string;
  modified_by_user?: boolean;
  modified_content?: string;
}

function getGlobalMemoryFilePath(): string {
  return path.join(homedir(), GEMINI_CONFIG_DIR, getCurrentGeminiMdFilename());
}

/**
 * Ensures proper newline separation before appending content.
 */
function ensureNewlineSeparation(currentContent: string): string {
  if (currentContent.length === 0) return '';
  if (currentContent.endsWith('\n\n') || currentContent.endsWith('\r\n\r\n'))
    return '';
  if (currentContent.endsWith('\n') || currentContent.endsWith('\r\n'))
    return '\n';
  return '\n\n';
}

async function readMemoryFileContent(): Promise<string> {
  try {
    return await fs.readFile(getGlobalMemoryFilePath(), 'utf-8');
  } catch (err) {
    const error = err as Error & { code?: string };
    if (!(error instanceof Error) || error.code !== 'ENOENT') throw err;
    return '';
  }
}

export class MemoryTool
  extends BaseDeclarativeTool<SaveMemoryParams, ToolResult>
  implements ModifiableDeclarativeTool<SaveMemoryParams>
{
  static readonly Name: string = memoryToolSchemaData.name!;
  constructor() {
    super(
      MemoryTool.Name,
      'Save Instruction',
      memoryToolDescription,
      Kind.Think,
      memoryToolSchemaData.parametersJsonSchema as Record<string, unknown>,
    );
  }

  override validateToolParams(params: SaveMemoryParams): string | null {
    const errors = SchemaValidator.validate(
      this.schema.parametersJsonSchema,
      params,
    );
    if (errors) {
      return errors;
    }

    if (params.instruction.trim() === '') {
      return 'Parameter "instruction" must be a non-empty string.';
    }

    return null;
  }

  protected createInvocation(params: SaveMemoryParams) {
    return new MemoryToolInvocation(params, this);
  }

  static async performAddMemoryEntry(
    text: string,
    memoryFilePath: string,
    fsAdapter: {
      readFile: (path: string, encoding: 'utf-8') => Promise<string>;
      writeFile: (
        path: string,
        data: string,
        encoding: 'utf-8',
      ) => Promise<void>;
      mkdir: (
        path: string,
        options: { recursive: boolean },
      ) => Promise<string | undefined>;
    },
  ): Promise<void> {
    let processedText = text.trim();
    // Remove leading hyphens and spaces that might be misinterpreted as markdown list items
    processedText = processedText.replace(/^(-+\s*)+/, '').trim();
    const newMemoryItem = `- ${processedText}`;

    try {
      await fsAdapter.mkdir(path.dirname(memoryFilePath), { recursive: true });
      let content = '';
      try {
        content = await fsAdapter.readFile(memoryFilePath, 'utf-8');
      } catch (_e) {
        // File doesn't exist, will be created with header and item.
      }

      const headerIndex = content.indexOf(INSTRUCTION_SECTION_HEADER);

      if (headerIndex === -1) {
        // Header not found, append header and then the entry
        const separator = ensureNewlineSeparation(content);
        content += `${separator}${INSTRUCTION_SECTION_HEADER}\n${newMemoryItem}\n`;
      } else {
        // Header found, find where to insert the new memory entry
        const startOfSectionContent =
          headerIndex + INSTRUCTION_SECTION_HEADER.length;
        let endOfSectionIndex = content.indexOf('\n## ', startOfSectionContent);
        if (endOfSectionIndex === -1) {
          endOfSectionIndex = content.length; // End of file
        }

        const beforeSectionMarker = content
          .substring(0, startOfSectionContent)
          .trimEnd();
        let sectionContent = content
          .substring(startOfSectionContent, endOfSectionIndex)
          .trimEnd();
        const afterSectionMarker = content.substring(endOfSectionIndex);

        sectionContent += `\n${newMemoryItem}`;
        content =
          `${beforeSectionMarker}\n${sectionContent.trimStart()}\n${afterSectionMarker}`.trimEnd() +
          '\n';
      }
      await fsAdapter.writeFile(memoryFilePath, content, 'utf-8');
    } catch (error) {
      console.error(
        `[MemoryTool] Error adding instruction entry to ${memoryFilePath}:`,
        error,
      );
      throw new Error(
        `[MemoryTool] Failed to add instruction entry: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  getModifyContext(_abortSignal: AbortSignal): ModifyContext<SaveMemoryParams> {
    return {
      getFilePath: (_params: SaveMemoryParams) => getGlobalMemoryFilePath(),
      getCurrentContent: async (_params: SaveMemoryParams): Promise<string> =>
        readMemoryFileContent(),
      getProposedContent: async (params: SaveMemoryParams): Promise<string> => {
        const currentContent = await readMemoryFileContent();
        return this.computeNewContent(currentContent, params.instruction);
      },
      createUpdatedParams: (
        _oldContent: string,
        modifiedProposedContent: string,
        originalParams: SaveMemoryParams,
      ): SaveMemoryParams => ({
        ...originalParams,
        modified_by_user: true,
        modified_content: modifiedProposedContent,
      }),
    };
  }

  computeNewContent(currentContent: string, instruction: string): string {
    let processedText = instruction.trim();
    processedText = processedText.replace(/^(-+\s*)+/, '').trim();
    const newMemoryItem = `- ${processedText}`;

    const headerIndex = currentContent.indexOf(MEMORY_SECTION_HEADER);

    if (headerIndex === -1) {
      // Header not found, append header and then the entry
      const separator = ensureNewlineSeparation(currentContent);
      return (
        currentContent +
        `${separator}${MEMORY_SECTION_HEADER}\n${newMemoryItem}\n`
      );
    } else {
      // Header found, find where to insert the new memory entry
      const startOfSectionContent = headerIndex + MEMORY_SECTION_HEADER.length;
      let endOfSectionIndex = currentContent.indexOf(
        '\n## ',
        startOfSectionContent,
      );
      if (endOfSectionIndex === -1) {
        endOfSectionIndex = currentContent.length; // End of file
      }

      const beforeSectionMarker = currentContent
        .substring(0, startOfSectionContent)
        .trimEnd();
      let sectionContent = currentContent
        .substring(startOfSectionContent, endOfSectionIndex)
        .trimEnd();
      const afterSectionMarker = currentContent.substring(endOfSectionIndex);

      sectionContent += `\n${newMemoryItem}`;
      return (
        `${beforeSectionMarker}\n${sectionContent.trimStart()}\n${afterSectionMarker}`.trimEnd() +
        '\n'
      );
    }
  }
}

class MemoryToolInvocation extends BaseToolInvocation<
  SaveMemoryParams,
  ToolResult
> {
  private static readonly allowlist: Set<string> = new Set();

  constructor(
    params: SaveMemoryParams,
    private readonly tool: MemoryTool,
  ) {
    super(params);
  }

  getDescription(): string {
    const memoryFilePath = getGlobalMemoryFilePath();
    return `in ${tildeifyPath(memoryFilePath)}`;
  }

  override async shouldConfirmExecute(
    _abortSignal: AbortSignal,
  ): Promise<ToolEditConfirmationDetails | false> {
    const memoryFilePath = getGlobalMemoryFilePath();
    const allowlistKey = memoryFilePath;

    if (MemoryToolInvocation.allowlist.has(allowlistKey)) {
      return false;
    }

    // Read current content of the memory file
    const currentContent = await readMemoryFileContent();

    // Calculate the new content that will be written to the memory file
    const newContent = this.tool.computeNewContent(
      currentContent,
      this.params.instruction,
    );

    const fileName = path.basename(memoryFilePath);
    const fileDiff = Diff.createPatch(
      fileName,
      currentContent,
      newContent,
      'Current',
      'Proposed',
      DEFAULT_DIFF_OPTIONS,
    );

    const confirmationDetails: ToolEditConfirmationDetails = {
      type: 'edit',
      title: `Confirm Memory Save: ${tildeifyPath(memoryFilePath)}`,
      fileName: memoryFilePath,
      filePath: memoryFilePath,
      fileDiff,
      originalContent: currentContent,
      newContent,
      onConfirm: async (outcome: ToolConfirmationOutcome) => {
        if (outcome === ToolConfirmationOutcome.ProceedAlways) {
          MemoryToolInvocation.allowlist.add(allowlistKey);
        }
      },
    };
    return confirmationDetails;
  }

  async execute(_signal: AbortSignal): Promise<ToolResult> {
    const { instruction, modified_by_user, modified_content } = this.params;

    try {
      if (modified_by_user && modified_content !== undefined) {
        // User modified the content in external editor, write it directly
        await fs.mkdir(path.dirname(getGlobalMemoryFilePath()), {
          recursive: true,
        });
        await fs.writeFile(
          getGlobalMemoryFilePath(),
          modified_content,
          'utf-8',
        );
        const successMessage = `Okay, I've updated the memory file with your modifications.`;
        return {
          llmContent: JSON.stringify({
            success: true,
            message: successMessage,
          }),
          returnDisplay: successMessage,
        };
      } else {
        // Use the normal memory entry logic
        await MemoryTool.performAddMemoryEntry(
          instruction,
          getGlobalMemoryFilePath(),
          {
            readFile: fs.readFile,
            writeFile: fs.writeFile,
            mkdir: fs.mkdir,
          },
        );
        const successMessage = `Okay, I've remembered that: "${instruction}"`;
        return {
          llmContent: JSON.stringify({
            success: true,
            message: successMessage,
          }),
          returnDisplay: successMessage,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `[MemoryTool] Error executing save_memory for instruction "${instruction}": ${errorMessage}`,
      );
      return {
        llmContent: JSON.stringify({
          success: false,
          error: `Failed to Save Instruction. Detail: ${errorMessage}`,
        }),
        returnDisplay: `Error saving instruction: ${errorMessage}`,
      };
    }
  }
}
