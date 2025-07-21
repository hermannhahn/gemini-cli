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
      'Adds a new memory entry. Use to store important information (user preferences, conversation context, project details) when explicitly asked by the user or when crucial for maintaining context across sessions.',
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
    return {
      llmContent: `STM entry added: id='${newEntry.id}'`,
      returnDisplay: `STM entry added: id='${newEntry.id}'`,
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
      'Searches for up to 3 relevant memories. Use descriptive keywords. Invoke when needing to recall information to understand context or formulate a response.',
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
      return {
        llmContent: `Invalid arguments for search_stm. Please provide either 'query', 'id', or 'date'.`,
        returnDisplay: `Invalid arguments for search_stm. Please provide either 'query', 'id', or 'date'.`,
      };
    }

    const stmFilePath = getProjectStmFile();
    if (!existsSync(stmFilePath)) {
      return {
        llmContent: 'STM file does not exist. No entries to search.',
        returnDisplay: 'STM file does not exist. No entries to search.',
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

    if (results.length === 0) {
      return {
        llmContent: 'No matching STM entries found.',
        returnDisplay: 'No matching STM entries found.',
      };
    }

    const jsonResult = JSON.stringify(results, null, 2);
    return {
      llmContent: jsonResult,
      returnDisplay: jsonResult,
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
      'Deletes a specific memory entry by its ID.',
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

    if (stmEntries.length === initialLength) {
      return {
        llmContent: `No STM entry found with ID: ${args.id}`,
        returnDisplay: `No STM entry found with ID: ${args.id}`,
      };
    }

    writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');

    return {
      llmContent: `STM entry with ID ${args.id} deleted successfully.`,
      returnDisplay: `STM entry with ID ${args.id} deleted successfully.`,
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
