/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import {
  MemoryTool,
  setGeminiMdFilename,
  getCurrentGeminiMdFilename,
  getAllGeminiMdFilenames,
  DEFAULT_CONTEXT_FILENAME,
} from './memoryTool.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// Mock dependencies
vi.mock('fs/promises');
vi.mock('os');

const INSTRUCTION_SECTION_HEADER = '## Gemini Added Instructions';

// Define a type for our fsAdapter to ensure consistency
interface FsAdapter {
  readFile: (path: string, encoding: 'utf-8') => Promise<string>;
  writeFile: (path: string, data: string, encoding: 'utf-8') => Promise<void>;
  mkdir: (
    path: string,
    options: { recursive: boolean },
  ) => Promise<string | undefined>;
}

describe('MemoryTool', () => {
  const mockAbortSignal = new AbortController().signal;

  const mockFsAdapter: {
    readFile: Mock<FsAdapter['readFile']>;
    writeFile: Mock<FsAdapter['writeFile']>;
    mkdir: Mock<FsAdapter['mkdir']>;
  } = {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(os.homedir).mockReturnValue('/mock/home');
    mockFsAdapter.readFile.mockReset();
    mockFsAdapter.writeFile.mockReset().mockResolvedValue(undefined);
    mockFsAdapter.mkdir
      .mockReset()
      .mockResolvedValue(undefined as string | undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Reset GEMINI_MD_FILENAME to its original value after each test
    setGeminiMdFilename(DEFAULT_CONTEXT_FILENAME);
  });

  describe('setGeminiMdFilename', () => {
    it('should update currentGeminiMdFilename when a valid new name is provided', () => {
      const newName = 'CUSTOM_CONTEXT.md';
      setGeminiMdFilename(newName);
      expect(getCurrentGeminiMdFilename()).toBe(newName);
    });

    it('should not update currentGeminiMdFilename if the new name is empty or whitespace', () => {
      const initialName = getCurrentGeminiMdFilename(); // Get current before trying to change
      setGeminiMdFilename('  ');
      expect(getCurrentGeminiMdFilename()).toBe(initialName);

      setGeminiMdFilename('');
      expect(getCurrentGeminiMdFilename()).toBe(initialName);
    });

    it('should handle an array of filenames', () => {
      const newNames = ['CUSTOM_CONTEXT.md', 'ANOTHER_CONTEXT.md'];
      setGeminiMdFilename(newNames);
      expect(getCurrentGeminiMdFilename()).toBe('CUSTOM_CONTEXT.md');
      expect(getAllGeminiMdFilenames()).toEqual(newNames);
    });
  });

  describe('performAddMemoryEntry (static method)', () => {
    const testFilePath = path.join(
      '/mock/home',
      '.gemini',
      DEFAULT_CONTEXT_FILENAME, // Use the default for basic tests
    );

    it('should create section and save an instruction if file does not exist', async () => {
      mockFsAdapter.readFile.mockRejectedValue({ code: 'ENOENT' }); // Simulate file not found
      const instruction = 'The sky is blue';
      await MemoryTool.performAddMemoryEntry(
        instruction,
        testFilePath,
        mockFsAdapter,
      );

      expect(mockFsAdapter.mkdir).toHaveBeenCalledWith(
        path.dirname(testFilePath),
        {
          recursive: true,
        },
      );
      expect(mockFsAdapter.writeFile).toHaveBeenCalledOnce();
      const writeFileCall = mockFsAdapter.writeFile.mock.calls[0];
      expect(writeFileCall[0]).toBe(testFilePath);
      const expectedContent = `${INSTRUCTION_SECTION_HEADER}\n- ${instruction}\n`;
      expect(writeFileCall[1]).toBe(expectedContent);
      expect(writeFileCall[2]).toBe('utf-8');
    });

    it('should create section and save an instruction if file is empty', async () => {
      mockFsAdapter.readFile.mockResolvedValue(''); // Simulate empty file
      const instruction = 'The sky is blue';
      await MemoryTool.performAddMemoryEntry(
        instruction,
        testFilePath,
        mockFsAdapter,
      );
      const writeFileCall = mockFsAdapter.writeFile.mock.calls[0];
      const expectedContent = `${INSTRUCTION_SECTION_HEADER}\n- ${instruction}\n`;
      expect(writeFileCall[1]).toBe(expectedContent);
    });

    it('should add an instruction to an existing section', async () => {
      const initialContent = `Some preamble.\n\n${INSTRUCTION_SECTION_HEADER}\n- Existing instruction 1\n`;
      mockFsAdapter.readFile.mockResolvedValue(initialContent);
      const instruction = 'New instruction 2';
      await MemoryTool.performAddMemoryEntry(
        instruction,
        testFilePath,
        mockFsAdapter,
      );

      expect(mockFsAdapter.writeFile).toHaveBeenCalledOnce();
      const writeFileCall = mockFsAdapter.writeFile.mock.calls[0];
      const expectedContent = `Some preamble.\n\n${INSTRUCTION_SECTION_HEADER}\n- Existing instruction 1\n- ${instruction}\n`;
      expect(writeFileCall[1]).toBe(expectedContent);
    });

    it('should add an instruction to an existing empty section', async () => {
      const initialContent = `Some preamble.\n\n${INSTRUCTION_SECTION_HEADER}\n`; // Empty section
      mockFsAdapter.readFile.mockResolvedValue(initialContent);
      const instruction = 'First instruction in section';
      await MemoryTool.performAddMemoryEntry(
        instruction,
        testFilePath,
        mockFsAdapter,
      );

      expect(mockFsAdapter.writeFile).toHaveBeenCalledOnce();
      const writeFileCall = mockFsAdapter.writeFile.mock.calls[0];
      const expectedContent = `Some preamble.

${INSTRUCTION_SECTION_HEADER}
- ${instruction}
`;
      expect(writeFileCall[1]).toBe(expectedContent);
    });

    it('should add an instruction when other ## sections exist and preserve spacing', async () => {
      const initialContent = `${INSTRUCTION_SECTION_HEADER}\n- Instruction 1\n\n## Another Section\nSome other text.`;
      mockFsAdapter.readFile.mockResolvedValue(initialContent);
      const instruction = 'Instruction 2';
      await MemoryTool.performAddMemoryEntry(
        instruction,
        testFilePath,
        mockFsAdapter,
      );

      expect(mockFsAdapter.writeFile).toHaveBeenCalledOnce();
      const writeFileCall = mockFsAdapter.writeFile.mock.calls[0];
      // Note: The implementation ensures a single newline at the end if content exists.
      const expectedContent = `${INSTRUCTION_SECTION_HEADER}\n- Instruction 1\n- ${instruction}\n\n## Another Section\nSome other text.\n`;
      expect(writeFileCall[1]).toBe(expectedContent);
    });

    it('should correctly trim and add an instruction that starts with a dash', async () => {
      mockFsAdapter.readFile.mockResolvedValue(
        `${INSTRUCTION_SECTION_HEADER}\n`,
      );
      const instruction = '- - My instruction with dashes';
      await MemoryTool.performAddMemoryEntry(
        instruction,
        testFilePath,
        mockFsAdapter,
      );
      const writeFileCall = mockFsAdapter.writeFile.mock.calls[0];
      const expectedContent = `${INSTRUCTION_SECTION_HEADER}\n- My instruction with dashes\n`;
      expect(writeFileCall[1]).toBe(expectedContent);
    });

    it('should handle error from fsAdapter.writeFile', async () => {
      mockFsAdapter.readFile.mockResolvedValue('');
      mockFsAdapter.writeFile.mockRejectedValue(new Error('Disk full'));
      const instruction = 'This will fail';
      await expect(
        MemoryTool.performAddMemoryEntry(
          instruction,
          testFilePath,
          mockFsAdapter,
        ),
      ).rejects.toThrow(
        '[MemoryTool] Failed to add instruction entry: Disk full',
      );
    });
  });

  describe('execute (instance method)', () => {
    let memoryTool: MemoryTool;
    let performAddMemoryEntrySpy: Mock<typeof MemoryTool.performAddMemoryEntry>;

    beforeEach(() => {
      memoryTool = new MemoryTool();
      // Spy on the static method for these tests
      performAddMemoryEntrySpy = vi
        .spyOn(MemoryTool, 'performAddMemoryEntry')
        .mockResolvedValue(undefined) as Mock<
        typeof MemoryTool.performAddMemoryEntry
      >;
      // Cast needed as spyOn returns MockInstance
    });

    it('should have correct name, displayName, description, and schema', () => {
      expect(memoryTool.name).toBe('save_instruction');
      expect(memoryTool.displayName).toBe('Save Instruction');
      expect(memoryTool.description).toContain(
        'Saves a permanent, immutable instruction for long-term memory.',
      );
      expect(memoryTool.schema).toBeDefined();
      expect(memoryTool.schema.name).toBe('save_instruction');
      expect(
        memoryTool.schema.parameters?.properties?.instruction,
      ).toBeDefined();
    });

    it('should call performAddMemoryEntry with correct parameters and return success', async () => {
      const params = { instruction: 'The sky is blue' };
      const result = await memoryTool.execute(params, mockAbortSignal);
      // Use getCurrentGeminiMdFilename for the default expectation before any setGeminiMdFilename calls in a test
      const expectedFilePath = path.join(
        '/mock/home',
        '.gemini',
        getCurrentGeminiMdFilename(), // This will be DEFAULT_CONTEXT_FILENAME unless changed by a test
      );

      // For this test, we expect the actual fs methods to be passed
      const expectedFsArgument = {
        readFile: fs.readFile,
        writeFile: fs.writeFile,
        mkdir: fs.mkdir,
      };

      expect(performAddMemoryEntrySpy).toHaveBeenCalledWith(
        params.instruction,
        expectedFilePath,
        expectedFsArgument,
      );
      const successMessage = `Okay, I've remembered that: "${params.instruction}"`;
      expect(result.llmContent).toBe(
        JSON.stringify({ success: true, message: successMessage }),
      );
      expect(result.returnDisplay).toBe(successMessage);
    });

    it('should return an error if instruction is empty', async () => {
      const params = { instruction: ' ' }; // Empty instruction
      const result = await memoryTool.execute(params, mockAbortSignal);
      const errorMessage =
        'Parameter "instruction" must be a non-empty string.';

      expect(performAddMemoryEntrySpy).not.toHaveBeenCalled();
      expect(result.llmContent).toBe(
        JSON.stringify({ success: false, error: errorMessage }),
      );
      expect(result.returnDisplay).toBe(`Error: ${errorMessage}`);
    });

    it('should handle errors from performAddMemoryEntry', async () => {
      const params = { instruction: 'This will fail' };
      const underlyingError = new Error(
        '[MemoryTool] Failed to add instruction entry: Disk full',
      );
      performAddMemoryEntrySpy.mockRejectedValue(underlyingError);

      const result = await memoryTool.execute(params, mockAbortSignal);

      expect(result.llmContent).toBe(
        JSON.stringify({
          success: false,
          error: `Failed to Save Instruction. Detail: ${underlyingError.message}`,
        }),
      );
      expect(result.returnDisplay).toBe(
        `Error saving instruction: ${underlyingError.message}`,
      );
    });
  });
});
