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

interface StmEntry {
  id: string;
  content: string;
  created_at: string;
  viewed_at: string;
}

/**
 * Adds a new entry to the Short-Term Memory (STM) file.
 */
export class AddStmTool extends BaseTool<
  { content: string },
  ToolResult
> {
  constructor() {
    super(
      'add_stm',
      'Add Short-Term Memory',
      'Adds a new entry to the Short-Term Memory (STM) file.',
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

    const now = new Date().toISOString();
    const newEntry: StmEntry = {
      id: crypto.randomUUID(),
      content: args.content,
      created_at: now,
      viewed_at: now,
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
  { query?: string; id?: string },
  ToolResult
> {
  constructor() {
    super(
      'search_stm',
      'Search Short-Term Memory',
      'Searches for up to 3 most relevant entries in the Short-Term Memory (STM) file. Use descriptive keywords in your query to find the most relevant memories. This tool should be used when the model receives a request and needs to recall information to understand the context or formulate a response.',
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
        },
      },
      true, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  async execute(
    args: { query?: string; id?: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    if (!args.query && !args.id) {
      return {
        llmContent: `Invalid arguments for search_stm. Please provide either 'query' or 'id'.`,
        returnDisplay: `Invalid arguments for search_stm. Please provide either 'query' or 'id'.`,
      };
    }

    const stmFilePath = getProjectStmFile();
    if (!existsSync(stmFilePath)) {
      return {
        llmContent: 'STM file does not exist. No entries to search.',
        returnDisplay: 'STM file does not exist. No entries to search.',
      };
    }

    let stmEntries: StmEntry[] = JSON.parse(readFileSync(stmFilePath, 'utf-8'));

    let results: StmEntry[] = [];
    if (args.id) {
      results = stmEntries.filter((entry) => entry.id === args.id);
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
    const now = new Date().toISOString();
    const updatedStmEntries = stmEntries.map((entry) => {
      if (results.some((result) => result.id === entry.id)) {
        return { ...entry, viewed_at: now };
      }
      return entry;
    });
    writeFileSync(stmFilePath, JSON.stringify(updatedStmEntries, null, 2), 'utf-8');

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
 * Cleans (removes) entries from the Short-Term Memory (STM) file.
 */
export class CleanStmTool extends BaseTool<
  { id?: string; all?: boolean },
  ToolResult
> {
  constructor() {
    super(
      'clean_stm',
      'Clean Short-Term Memory',
      'Cleans (removes) entries from the Short-Term Memory (STM) file.',
      Icon.Hammer,
      {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'The ID of the STM entry to remove.',
          },
          all: {
            type: Type.BOOLEAN,
            description: 'If true, removes all STM entries.',
          },
        },
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  async execute(
    args: { id?: string; all?: boolean },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    if (!args.id && !args.all) {
      return {
        llmContent: `Invalid arguments for clean_stm. Please provide either 'id' or 'all'.`,
        returnDisplay: `Invalid arguments for clean_stm. Please provide either 'id' or 'all'.`,
      };
    }

    const stmFilePath = getProjectStmFile();
    if (!existsSync(stmFilePath)) {
      return {
        llmContent: 'STM file does not exist. No entries to clean.',
        returnDisplay: 'STM file does not exist. No entries to clean.',
      };
    }

    if (args.all) {
      writeFileSync(stmFilePath, JSON.stringify([], null, 2), 'utf-8');
      return {
        llmContent: 'All STM entries cleaned.',
        returnDisplay: 'All STM entries cleaned.',
      };
    } else if (args.id) {
      const fileContent = readFileSync(stmFilePath, 'utf-8');
      let stmEntries: StmEntry[] = JSON.parse(fileContent);
      const initialLength = stmEntries.length;
      stmEntries = stmEntries.filter((entry) => entry.id !== args.id);

      if (stmEntries.length === initialLength) {
        return {
          llmContent: `No STM entry found with ID: '${args.id}'.`,
          returnDisplay: `No STM entry found with ID: '${args.id}'.`,
        };
      }

      writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
      return {
        llmContent: `STM entry with ID '${args.id}' removed.`,
        returnDisplay: `STM entry with ID '${args.id}' removed.`,
      };
    }
    return {
      llmContent: `Invalid arguments for clean_stm. Please provide either 'id' or 'all'.`,
      returnDisplay: `Invalid arguments for clean_stm. Please provide either 'id' or 'all'.`,
    };
  }
}
