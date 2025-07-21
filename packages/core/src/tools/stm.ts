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

interface StmEntry {
  key: string;
  value: string;
  timestamp: string;
}

/**
 * Adds a new entry to the Short-Term Memory (STM) file.
 */
export class AddStmTool extends BaseTool<
  { key: string; value: string },
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
          key: {
            type: Type.STRING,
            description: 'The key for the STM entry.',
          },
          value: {
            type: Type.STRING,
            description: 'The value for the STM entry.',
          },
        },
        required: ['key', 'value'],
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  async execute(
    args: { key: string; value: string },
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

    const newEntry: StmEntry = {
      key: args.key,
      value: args.value,
      timestamp: new Date().toISOString(),
    };
    stmEntries.push(newEntry);

    writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
    return {
      llmContent: `STM entry added: key='${args.key}'`,
      returnDisplay: `STM entry added: key='${args.key}'`,
    };
  }
}

/**
 * Searches for entries in the Short-Term Memory (STM) file.
 */
export class SearchStmTool extends BaseTool<
  { query?: string; key?: string },
  ToolResult
> {
  constructor() {
    super(
      'search_stm',
      'Search Short-Term Memory',
      'Searches for entries in the Short-Term Memory (STM) file.',
      Icon.FileSearch,
      {
        type: Type.OBJECT,
        properties: {
          query: {
            type: Type.STRING,
            description: 'A general query to search for in STM entries.',
          },
          key: {
            type: Type.STRING,
            description: 'A specific key to search for in STM entries.',
          },
        },
      },
      true, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  async execute(
    args: { query?: string; key?: string },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    if (!args.query && !args.key) {
      return {
        llmContent: `Invalid arguments for search_stm. Please provide either 'query' or 'key'.`,
        returnDisplay: `Invalid arguments for search_stm. Please provide either 'query' or 'key'.`,
      };
    }

    const stmFilePath = getProjectStmFile();
    if (!existsSync(stmFilePath)) {
      return {
        llmContent: 'STM file does not exist. No entries to search.',
        returnDisplay: 'STM file does not exist. No entries to search.',
      };
    }

    const fileContent = readFileSync(stmFilePath, 'utf-8');
    const stmEntries: StmEntry[] = JSON.parse(fileContent);

    let results: StmEntry[] = [];
    if (args.key) {
      results = stmEntries.filter((entry) => entry.key === args.key);
    } else if (args.query) {
      const lowerCaseQuery = args.query.toLowerCase();
      results = stmEntries.filter(
        (entry) =>
          entry.key.toLowerCase().includes(lowerCaseQuery) ||
          entry.value.toLowerCase().includes(lowerCaseQuery),
      );
    }

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
  { key?: string; all?: boolean },
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
          key: {
            type: Type.STRING,
            description: 'The key of the STM entry to remove.',
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
    args: { key?: string; all?: boolean },
    _signal: AbortSignal,
  ): Promise<ToolResult> {
    if (!args.key && !args.all) {
      return {
        llmContent: `Invalid arguments for clean_stm. Please provide either 'key' or 'all'.`,
        returnDisplay: `Invalid arguments for clean_stm. Please provide either 'key' or 'all'.`,
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
    } else if (args.key) {
      const fileContent = readFileSync(stmFilePath, 'utf-8');
      let stmEntries: StmEntry[] = JSON.parse(fileContent);
      const initialLength = stmEntries.length;
      stmEntries = stmEntries.filter((entry) => entry.key !== args.key);

      if (stmEntries.length === initialLength) {
        return {
          llmContent: `No STM entry found with key: '${args.key}'.`,
          returnDisplay: `No STM entry found with key: '${args.key}'.`,
        };
      }

      writeFileSync(stmFilePath, JSON.stringify(stmEntries, null, 2), 'utf-8');
      return {
        llmContent: `STM entry with key '${args.key}' removed.`,
        returnDisplay: `STM entry with key '${args.key}' removed.`,
      };
    }
    return {
      llmContent: `Invalid arguments for clean_stm. Please provide either 'key' or 'all'.`,
      returnDisplay: `Invalid arguments for clean_stm. Please provide either 'key' or 'all'.`,
    };
  }
}
