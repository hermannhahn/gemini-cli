/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeclarativeTool, Icon, ToolResult } from './tools.js';
import { getProjectStmFile } from '../utils/paths.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { Type } from '@google/genai';
import { ToolInvocation } from './tools.js';
import * as crypto from 'crypto';

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface StmEntry {
  id: string;
  content: string;
  created_at: string;
  viewed_at: string;
}

/**
 * Adds a new entry to the Short-Term Memory (STM) file.
 */
export class AddStmTool extends DeclarativeTool<
  { content: string },
  ToolResult
> {
  constructor() {
    super(
      'add_memory',
      'Add memory',
      'Saves memories to maintain context and enhance future interactions. Proactively record user preferences, project details, or key instructions. For optimal retrieval, use a `Key: Value` format (e.g., `User Name: John Doe`).',
      Icon.LightBulb,
      {
        type: Type.OBJECT,
        properties: {
          content: {
            type: Type.STRING,
            description:
              'The memory content. Prefer `Key: Value` format (e.g., `User Name: John Doe`, `Project Context: Gemini CLI fork`)',
          },
        },
        required: ['content'],
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  build(_params: {
    content: string;
  }): ToolInvocation<{ content: string }, ToolResult> {
    throw new Error('Method not implemented.');
  }

  async execute(
    args: { content: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    const stmFilePath = getProjectStmFile();
    let stmEntries: StmEntry[] = [];

    if (existsSync(stmFilePath)) {
      const fileContent = readFileSync(stmFilePath, 'utf-8');
      stmEntries = JSON.parse(fileContent);
    } else {
      const dir = dirname(stmFilePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }

    const now = new Date();
    const newEntry: StmEntry = {
      id: crypto.randomUUID(),
      content: args.content,
      created_at: formatDateToYYYYMMDD(now),
      viewed_at: formatDateToYYYYMMDD(now),
    };
    stmEntries.push(newEntry);

    writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
    let returnDisplay = `memory entry added: id='${newEntry.id}'`;
    let llmContent = `memory entry added: id='${newEntry.id}'`;
    if (process.env.STM_SHOW_STATUS !== 'TRUE') {
      returnDisplay = '';
      llmContent = ''; // Adicionado para suprimir a saída do modelo
    }
    return {
      llmContent,
      returnDisplay,
    };
  }
}

/**
 * Searches for entries in the Short-Term Memory (STM) file.
 */
export class SearchStmTool extends DeclarativeTool<
  { query?: string; id?: string; date?: string },
  ToolResult
> {
  constructor() {
    super(
      'search_memory',
      'Search for memory',
      'Searches memories for context. Use when understanding is uncertain. If initial query fails, try broader terms or multiple single-term queries. `query` parameter performs literal string match; it does not support boolean operators (e.g., `OR`).',
      Icon.FileSearch,
      {
        type: Type.OBJECT,
        properties: {
          query: {
            type: Type.STRING,
            description:
              'Keywords or phrases to search memory content. Performs literal match; no boolean operators.',
          },
          id: {
            type: Type.STRING,
            description: 'Specific memory ID for search.',
          },
          date: {
            type: Type.STRING,
            description: 'Specific date (YYYY-MM-DD) for search.',
          },
        },
      },
      true, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  build(_params: {
    query?: string;
    id?: string;
    date?: string;
  }): ToolInvocation<
    { query?: string; id?: string; date?: string },
    ToolResult
  > {
    throw new Error('Method not implemented.');
  }
  async execute(
    args: { query?: string; id?: string; date?: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    if (!args.query && !args.id && !args.date) {
      let returnDisplay = `Invalid arguments for search_memory. Please provide either 'query', 'id', or 'date'.`;
      if (process.env.STM_SHOW_STATUS !== 'TRUE') {
        returnDisplay = '';
      }
      return {
        llmContent: `Invalid arguments for search_memory. Please provide either 'query', 'id', or 'date'.`,
        returnDisplay,
      };
    }

    const stmFilePath = getProjectStmFile();
    if (!existsSync(stmFilePath)) {
      let returnDisplay = 'Memory file does not exist. No entries to search.';
      if (process.env.STM_SHOW_STATUS !== 'TRUE') {
        returnDisplay = '';
      }
      return {
        llmContent: 'Memory file does not exist. No entries to search.',
        returnDisplay,
      };
    }

    const stmEntries: StmEntry[] = JSON.parse(
      readFileSync(stmFilePath, 'utf-8'),
    );

    let results: StmEntry[] = [];
    if (args.id) {
      results = stmEntries.filter((entry) => entry.id === args.id);
    } else if (args.date) {
      results = stmEntries.filter((entry) => entry.created_at === args.date);
    } else if (args.query) {
      const lowerCaseQuery = args.query.toLowerCase();
      const lowerCaseQueryWords = lowerCaseQuery
        .split(/\s+/)
        .filter((word) => word.length > 0); // Divide a query em palavras
      const scoredEntries = stmEntries.map((entry) => {
        let score = 0;
        const lowerCaseContent = entry.content.toLowerCase();

        // Verifica se todas as palavras da query estão presentes no conteúdo
        const allWordsPresent = lowerCaseQueryWords.every((word) =>
          lowerCaseContent.includes(word),
        );

        if (allWordsPresent) {
          score += 1; // Pontua se todas as palavras estiverem presentes
        }

        // Opcional: Adicionar pontuação baseada em correspondência exata da frase para priorizar
        if (lowerCaseContent.includes(lowerCaseQuery)) {
          score += 0.5; // Pontuação extra para correspondência exata da frase
        }
        return { entry, score };
      });

      scoredEntries.sort((a, b) => b.score - a.score); // Sort by score descending
      results = scoredEntries
        .filter((item) => item.score > 0)
        .map((item) => item.entry)
        .slice(0, 3); // Take top 3
    }

    // Update viewed_at for returned results and save back to file
    const now = new Date();
    const updatedStmEntries = stmEntries.map((entry) => {
      if (results.some((result) => result.id === entry.id)) {
        return { ...entry, viewed_at: formatDateToYYYYMMDD(now) };
      }
      return entry;
    });
    writeFileSync(
      stmFilePath,
      JSON.stringify(updatedStmEntries, null, 2),
      'utf-8',
    );

    const jsonResult = JSON.stringify(results, null, 2);
    let llmContent: string;
    let returnDisplay: string;

    if (results.length === 0) {
      llmContent =
        'No matching memories entries found. The search returns occurrences containing all query words, case-insensitive. Consider trying broader terms or alternative queries to locate the memory.';
      returnDisplay = 'No matching memories entries found.';
    } else {
      llmContent = jsonResult;
      returnDisplay = jsonResult;
    }

    if (process.env.STM_SHOW_STATUS !== 'TRUE') {
      returnDisplay = '';
    }

    return {
      llmContent,
      returnDisplay,
    };
  }
}

/**
 * Deletes an entry from the Short-Term Memory (STM) file by ID.
 */
export class DeleteStmTool extends DeclarativeTool<{ id: string }, ToolResult> {
  constructor() {
    super(
      'delete_memory',
      'Delete memory',
      'Deletes a memory entry by its ID. Use for irrelevant/outdated entries or user-requested deletion.',
      Icon.Trash,
      {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'The ID of the memory entry to delete.',
          },
        },
        required: ['id'],
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  build(_params: { id: string }): ToolInvocation<{ id: string }, ToolResult> {
    throw new Error('Method not implemented.');
  }

  async execute(
    args: { id: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    const stmFilePath = getProjectStmFile();

    if (!existsSync(stmFilePath)) {
      return {
        llmContent: 'Memory file does not exist. No entries to delete.',
        returnDisplay: 'Memory file does not exist. No entries to delete.',
      };
    }

    let stmEntries: StmEntry[] = JSON.parse(readFileSync(stmFilePath, 'utf-8'));

    const initialLength = stmEntries.length;
    stmEntries = stmEntries.filter((entry) => entry.id !== args.id);

    let llmContent: string;
    let returnDisplay: string;
    if (stmEntries.length === initialLength) {
      llmContent = `No memory entry found with ID: ${args.id}`;
      returnDisplay = `No memory entry found with ID: ${args.id}`;
    } else {
      llmContent = `Memory entry with ID ${args.id} deleted successfully.`;
      returnDisplay = `Memory entry with ID ${args.id} deleted successfully.`;
      writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
    }

    if (process.env.STM_SHOW_STATUS !== 'TRUE') {
      returnDisplay = '';
      llmContent = '';
    }

    return {
      llmContent,
      returnDisplay,
    };
  }
}

/**
 * Clears entries from the Short-Term Memory (STM) file older than 35 days.
 */
export class ClearStmTool {
  async execute(): Promise<void> {
    const stmFilePath = getProjectStmFile();

    if (!existsSync(stmFilePath)) {
      console.log('Memory file does not exist. No entries to clear.');
      return;
    }

    let stmEntries: StmEntry[] = JSON.parse(readFileSync(stmFilePath, 'utf-8'));

    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);
    const thirtyFiveDaysAgoFormatted = formatDateToYYYYMMDD(thirtyFiveDaysAgo);

    const initialLength = stmEntries.length;
    stmEntries = stmEntries.filter(
      (entry) => entry.viewed_at > thirtyFiveDaysAgoFormatted,
    );

    if (stmEntries.length === initialLength) {
      console.log('No memory entries older than 35 days found to clear.');
      return;
    }

    writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
    console.log(
      `Cleared ${initialLength - stmEntries.length} old memory entries.`,
    );
  }
}
