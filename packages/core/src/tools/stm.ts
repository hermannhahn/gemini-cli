/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool, Icon, ToolResult } from './tools.js';
import { getProjectStmFile } from '../utils/paths.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { Type } from '@google/genai';
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
export class AddStmTool extends BaseTool<{ content: string }, ToolResult> {
  constructor() {
    super(
      'add_stm',
      'Add Short-Term Memory',
      'Use it to save memories that help maintain context between sessions. Notes, reminders, instructions, information, ideas, memories, or any information relevant to the user and your social interactions with them. Or if the user asks you to remember something.',
      Icon.LightBulb,
      {
        type: Type.OBJECT,
        properties: {
          content: {
            type: Type.STRING,
            description: 'The content of the STM entry.',
          },
        },
        required: ['content'],
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
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
    let returnDisplay = `STM entry added: id='${newEntry.id}'`;
    let llmContent = `STM entry added: id='${newEntry.id}'`;
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
export class SearchStmTool extends BaseTool<
  { query?: string; id?: string; date?: string },
  ToolResult
> {
  constructor() {
    super(
      'search_stm',
      'Search Short-Term Memory',
      'Search for relevant or date-related memories. Use to find memories that help understand the context of the user request.',
      Icon.FileSearch,
      {
        type: Type.OBJECT,
        properties: {
          query: {
            type: Type.STRING,
            description: 'A general query to search for in STM entries.',
          },
          id: {
            type: Type.STRING,
            description: 'A specific ID to search for in STM entries.',
          },
          date: {
            type: Type.STRING,
            description:
              'A specific date (YYYY-MM-DD) to search for in STM entries.',
          },
        },
      },
      true, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  async execute(
    args: { query?: string; id?: string; date?: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    if (!args.query && !args.id && !args.date) {
      let returnDisplay = `Invalid arguments for search_stm. Please provide either 'query', 'id', or 'date'.`;
      if (process.env.STM_SHOW_STATUS !== 'TRUE') {
        returnDisplay = '';
      }
      return {
        llmContent: `Invalid arguments for search_stm. Please provide either 'query', 'id', or 'date'.`,
        returnDisplay,
      };
    }

    const stmFilePath = getProjectStmFile();
    if (!existsSync(stmFilePath)) {
      let returnDisplay = 'STM file does not exist. No entries to search.';
      if (process.env.STM_SHOW_STATUS !== 'TRUE') {
        returnDisplay = '';
      }
      return {
        llmContent: 'STM file does not exist. No entries to search.',
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
      const scoredEntries = stmEntries.map((entry) => {
        let score = 0;
        if (entry.content.toLowerCase().includes(lowerCaseQuery)) {
          score += 1; // Score for content matches
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
      llmContent = 'No matching STM entries found.';
      returnDisplay = 'No matching STM entries found.';
    } else {
      llmContent = jsonResult;
      returnDisplay = jsonResult;
    }

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
 * Deletes an entry from the Short-Term Memory (STM) file by ID.
 */
export class DeleteStmTool extends BaseTool<{ id: string }, ToolResult> {
  constructor() {
    super(
      'delete_stm',
      'Delete Short-Term Memory',
      'Deletes a specific temporary memory entry by its ID. Use to remove irrelevant or outdated STM entries or if the user requests deletion.',
      Icon.Trash,
      {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'The ID of the STM entry to delete.',
          },
        },
        required: ['id'],
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  async execute(
    args: { id: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    const stmFilePath = getProjectStmFile();

    if (!existsSync(stmFilePath)) {
      return {
        llmContent: 'STM file does not exist. No entries to delete.',
        returnDisplay: 'STM file does not exist. No entries to delete.',
      };
    }

    let stmEntries: StmEntry[] = JSON.parse(readFileSync(stmFilePath, 'utf-8'));

    const initialLength = stmEntries.length;
    stmEntries = stmEntries.filter((entry) => entry.id !== args.id);

    let llmContent: string;
    let returnDisplay: string;
    if (stmEntries.length === initialLength) {
      llmContent = `No STM entry found with ID: ${args.id}`;
      returnDisplay = `No STM entry found with ID: ${args.id}`;
    } else {
      llmContent = `STM entry with ID ${args.id} deleted successfully.`;
      returnDisplay = `STM entry with ID ${args.id} deleted successfully.`;
      writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
    }

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
 * Clears entries from the Short-Term Memory (STM) file older than 35 days.
 */
export class ClearStmTool {
  async execute(): Promise<void> {
    const stmFilePath = getProjectStmFile();

    if (!existsSync(stmFilePath)) {
      console.log('STM file does not exist. No entries to clear.');
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
      console.log('No STM entries older than 35 days found to clear.');
      return;
    }

    writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
    console.log(
      `Cleared ${initialLength - stmEntries.length} old STM entries.`,
    );
  }
}
