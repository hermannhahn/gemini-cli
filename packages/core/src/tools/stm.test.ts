/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AddStmTool,
  SearchStmTool,
  DeleteStmTool,
  ClearStmTool,
  StmEntry,
} from './stm.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { getProjectStmFile } from '../utils/paths.js';
import * as crypto from 'crypto';

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Mock the fs module
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  };
});

// Mock the getProjectStmFile
vi.mock('../utils/paths.js', () => ({
  getProjectStmFile: vi.fn(() => '/mock/path/to/stm.json'),
}));

// Mock crypto.randomUUID
vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('crypto')>();
  let counter = 0;
  return {
    ...actual,
    randomUUID: vi.fn(() => {
      counter++;
      // Generate a valid-looking UUID for testing purposes
      return `00000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
    }),
  };
});

describe('STM Tools', () => {
  const mockStmFilePath = '/mock/path/to/stm.json';
  let mockStmContent: StmEntry[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(readFileSync).mockReturnValue('[]');
    vi.mocked(writeFileSync).mockClear();
    vi.mocked(mkdirSync).mockClear();
    vi.mocked(getProjectStmFile).mockReturnValue(mockStmFilePath);
    vi.mocked(crypto.randomUUID).mockClear();
    let counter = 0;
    vi.mocked(crypto.randomUUID).mockImplementation(() => {
      counter++;
      return `00000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
    });
    mockStmContent = [];

    // Mock readFileSync to return current mockStmContent
    vi.mocked(readFileSync).mockImplementation(() =>
      JSON.stringify(mockStmContent),
    );
    // Mock writeFileSync to update mockStmContent
    vi.mocked(writeFileSync).mockImplementation((path, data) => {
      if (path === mockStmFilePath) {
        mockStmContent = JSON.parse(data as string);
      }
    });
    vi.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    process.env.STM_SHOW_STATUS = 'TRUE'; // Default to TRUE for most tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('AddStmTool', () => {
    it('should add a new entry to an empty STM file', async () => {
      const tool = new AddStmTool();
      const content = 'test content 1';
      const result = await tool.execute(
        { content },
        new AbortController().signal,
      );

      expect(writeFileSync).toHaveBeenCalledWith(
        mockStmFilePath,
        JSON.stringify(mockStmContent, null, 2),
        'utf-8',
      );
      expect(mockStmContent[0]).toEqual(
        expect.objectContaining({
          content,
          id: expect.any(String),
          created_at: expect.any(String),
          viewed_at: expect.any(String),
        }),
      );
      expect(mockStmContent).toHaveLength(1);
      expect(mockStmContent[0].content).toBe(content);
      expect(mockStmContent[0].id).toMatch(/^00000000-0000-4000-8000-/); // Check UUID format
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? `STM entry added: id='${mockStmContent[0].id}'`
          : '',
      );
    });

    it('should add a new entry to an existing STM file', async () => {
      // Set up mockStmContent with an existing entry
      mockStmContent = [
        {
          id: 'existing-uuid-1',
          content: 'existing content',
          created_at: '2024-01-01T00:00:00.000Z',
          viewed_at: '2024-01-01T00:00:00.000Z',
        },
      ];
      vi.mocked(existsSync).mockReturnValue(true);

      const tool = new AddStmTool();
      const content = 'test content 2';
      const result = await tool.execute(
        { content },
        new AbortController().signal,
      );

      expect(writeFileSync).toHaveBeenCalledWith(
        mockStmFilePath,
        JSON.stringify(mockStmContent, null, 2),
        'utf-8',
      );
      expect(mockStmContent).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'existing-uuid-1',
            content: 'existing content',
            created_at: expect.any(String),
            viewed_at: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            content: 'test content 2',
            created_at: expect.any(String),
            viewed_at: expect.any(String),
          }),
        ]),
      );
      expect(mockStmContent).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'existing-uuid-1',
            content: 'existing content',
            created_at: expect.any(String),
            viewed_at: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            content: 'test content 2',
            created_at: expect.any(String),
            viewed_at: expect.any(String),
          }),
        ]),
      );
      expect(mockStmContent).toHaveLength(2);
      expect(mockStmContent.find((e) => e.content === content)?.id).toMatch(
        /^00000000-0000-4000-8000-/,
      );
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? `STM entry added: id='${mockStmContent[1].id}'`
          : '',
      );
    });

    it('should create directory if it does not exist', async () => {
      vi.mocked(existsSync).mockImplementation((path) => {
        if (path === '/mock/path/to') return false; // Simulate directory not existing
        if (path === mockStmFilePath) return false; // Simulate file not existing
        return true;
      });

      const tool = new AddStmTool();
      const content = 'test content 3';
      await tool.execute({ content }, new AbortController().signal);

      expect(mkdirSync).toHaveBeenCalledWith('/mock/path/to', {
        recursive: true,
      });
      expect(writeFileSync).toHaveBeenCalledOnce();
    });
  });

  describe('SearchStmTool', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
      mockStmContent = [
        {
          id: 'id-1',
          content: 'apple banana',
          created_at: formatDateToYYYYMMDD(
            new Date('2024-01-01T00:00:00.000Z'),
          ),
          viewed_at: formatDateToYYYYMMDD(new Date('2024-01-01T00:00:00.000Z')),
        },
        {
          id: 'id-2',
          content: 'orange apple',
          created_at: formatDateToYYYYMMDD(
            new Date('2024-01-02T00:00:00.000Z'),
          ),
          viewed_at: formatDateToYYYYMMDD(new Date('2024-01-02T00:00:00.000Z')),
        },
        {
          id: 'id-3',
          content: 'grape',
          created_at: formatDateToYYYYMMDD(
            new Date('2024-01-03T00:00:00.000Z'),
          ),
          viewed_at: formatDateToYYYYMMDD(new Date('2024-01-03T00:00:00.000Z')),
        },
        {
          id: 'id-4',
          content: 'apple pie',
          created_at: formatDateToYYYYMMDD(
            new Date('2024-01-04T00:00:00.000Z'),
          ),
          viewed_at: formatDateToYYYYMMDD(new Date('2024-01-04T00:00:00.000Z')),
        },
      ];
      vi.mocked(existsSync).mockReturnValue(true);
    });

    it('should return error if no query or id is provided', async () => {
      const tool = new SearchStmTool();
      const result = await tool.execute({}, new AbortController().signal);
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? `Invalid arguments for search_stm. Please provide either 'query', 'id', or 'date'.`
          : '',
      );
    });

    it('should return no entries if STM file does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const tool = new SearchStmTool();
      const result = await tool.execute(
        { query: 'test' },
        new AbortController().signal,
      );
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? 'STM file does not exist. No entries to search.'
          : '',
      );
    });

    it('should search by id and update viewed_at', async () => {
      const tool = new SearchStmTool();

      vi.advanceTimersByTime(1000); // Advance time to ensure viewed_at is updated

      const result = await tool.execute(
        { id: 'id-2' },
        new AbortController().signal,
      );
      const parsedResult =
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? JSON.parse(result.llmContent as string)
          : [];
      expect(parsedResult).toHaveLength(1);
      expect(parsedResult[0].id).toBe('id-2');
      // viewed_at deve ser uma string e diferente de created_at
      expect(typeof parsedResult[0].viewed_at).toBe('string');
      expect(typeof parsedResult[0].viewed_at).toBe('string');
      expect(mockStmContent[1].viewed_at).toBe(
        formatDateToYYYYMMDD(new Date()),
      );
    });

    it('should search by query and return top 3 relevant entries and update viewed_at', async () => {
      const tool = new SearchStmTool();

      vi.advanceTimersByTime(1000); // Advance time to ensure viewed_at is updated

      const result = await tool.execute(
        { query: 'apple' },
        new AbortController().signal,
      );
      const parsedResult =
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? JSON.parse(result.llmContent as string)
          : [];
      expect(parsedResult).toHaveLength(3);
      expect(parsedResult.map((entry: StmEntry) => entry.id)).toEqual([
        'id-1',
        'id-2',
        'id-4',
      ]);

      // Check if viewed_at is updated for returned results

      expect(mockStmContent[0].viewed_at).toBe(
        formatDateToYYYYMMDD(new Date()),
      );
      expect(mockStmContent[1].viewed_at).toBe(
        formatDateToYYYYMMDD(new Date()),
      );
      expect(mockStmContent[3].viewed_at).toBe(
        formatDateToYYYYMMDD(new Date()),
      );
    });

    it('should return no matching entries found', async () => {
      const tool = new SearchStmTool();
      const result = await tool.execute(
        { query: 'xyz' },
        new AbortController().signal,
      );
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? 'No matching STM entries found.'
          : '',
      );
    });
  });

  describe('DeleteStmTool', () => {
    beforeEach(() => {
      mockStmContent = [
        {
          id: 'id-1',
          content: 'content 1',
          created_at: '2024-01-01T00:00:00.000Z',
          viewed_at: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'id-2',
          content: 'content 2',
          created_at: '2024-01-02T00:00:00.000Z',
          viewed_at: '2024-01-02T00:00:00.000Z',
        },
      ];
      vi.mocked(existsSync).mockReturnValue(true);
    });

    it('should delete an existing entry by ID', async () => {
      const tool = new DeleteStmTool();
      const result = await tool.execute(
        { id: 'id-1' },
        new AbortController().signal,
      );

      expect(writeFileSync).toHaveBeenCalledWith(
        mockStmFilePath,
        JSON.stringify(
          [
            {
              id: 'id-2',
              content: 'content 2',
              created_at: '2024-01-02T00:00:00.000Z',
              viewed_at: '2024-01-02T00:00:00.000Z',
            },
          ],
          null,
          2,
        ),
        'utf-8',
      );
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? 'STM entry with ID id-1 deleted successfully.'
          : '',
      );
      expect(mockStmContent).toHaveLength(1);
      expect(mockStmContent[0].id).toBe('id-2');
    });

    it('should return message if STM file does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const tool = new DeleteStmTool();
      const result = await tool.execute(
        { id: 'id-1' },
        new AbortController().signal,
      );
      expect(result.llmContent).toBe(
        'STM file does not exist. No entries to delete.',
      );
    });

    it('should return message if entry not found', async () => {
      const tool = new DeleteStmTool();
      const result = await tool.execute(
        { id: 'non-existent-id' },
        new AbortController().signal,
      );
      expect(result.llmContent).toBe(
        process.env.STM_SHOW_STATUS === 'TRUE'
          ? 'No STM entry found with ID: non-existent-id'
          : '',
      );
      expect(writeFileSync).not.toHaveBeenCalled(); // No write operation if no change
    });
  });

  describe('ClearStmTool', () => {
    beforeEach(() => {
      // Set up mockStmContent with entries of varying ages
      const now = new Date();
      const recentEntry = {
        id: 'recent-1',
        content: 'recent content',
        created_at: formatDateToYYYYMMDD(now),
        viewed_at: formatDateToYYYYMMDD(now),
      };

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const thirtyDaysAgoEntry = {
        id: '30-days-ago',
        content: '30 days old',
        created_at: formatDateToYYYYMMDD(thirtyDaysAgo),
        viewed_at: formatDateToYYYYMMDD(thirtyDaysAgo),
      };

      const fortyDaysAgo = new Date();
      fortyDaysAgo.setDate(now.getDate() - 40);
      const fortyDaysAgoEntry = {
        id: '40-days-ago',
        content: '40 days old',
        created_at: formatDateToYYYYMMDD(fortyDaysAgo),
        viewed_at: formatDateToYYYYMMDD(fortyDaysAgo),
      };

      const fiftyDaysAgo = new Date();
      fiftyDaysAgo.setDate(now.getDate() - 50);
      const fiftyDaysAgoEntry = {
        id: '50-days-ago',
        content: '50 days old',
        created_at: formatDateToYYYYMMDD(fiftyDaysAgo),
        viewed_at: formatDateToYYYYMMDD(fiftyDaysAgo),
      };

      mockStmContent = [
        recentEntry,
        thirtyDaysAgoEntry,
        fortyDaysAgoEntry,
        fiftyDaysAgoEntry,
      ];
      vi.mocked(existsSync).mockReturnValue(true);
      vi.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    });

    it('should clear entries older than 35 days based on viewed_at', async () => {
      const tool = new ClearStmTool();
      await tool.execute();

      expect(writeFileSync).toHaveBeenCalledOnce();
      expect(mockStmContent).toHaveLength(2); // Should keep recent and 30-days-ago entries
      expect(mockStmContent.map((entry) => entry.id)).toEqual([
        'recent-1',
        '30-days-ago',
      ]);
      expect(console.log).toHaveBeenCalledWith('Cleared 2 old STM entries.');
    });

    it('should do nothing if STM file does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const tool = new ClearStmTool();
      await tool.execute();

      expect(writeFileSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'STM file does not exist. No entries to clear.',
      );
    });

    it('should do nothing if no entries are older than 35 days', async () => {
      const now = new Date();
      const recentEntry1 = {
        id: 'recent-1',
        content: 'recent content 1',
        created_at: now.toISOString(),
        viewed_at: now.toISOString(),
      };
      const recentEntry2 = {
        id: 'recent-2',
        content: 'recent content 2',
        created_at: now.toISOString(),
        viewed_at: now.toISOString(),
      };
      mockStmContent = [recentEntry1, recentEntry2];

      const tool = new ClearStmTool();
      await tool.execute();

      expect(writeFileSync).not.toHaveBeenCalled();
      expect(mockStmContent).toHaveLength(2);
      expect(console.log).toHaveBeenCalledWith(
        'No STM entries older than 35 days found to clear.',
      );
    });
  });
});
