/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { narratorCommand } from './narratorCommand.js';
import { MessageType } from '../types.js';
import { CommandContext } from './types.js';
import { LoadedSettings } from '../../config/settings.js';
import { Logger } from '@hahnd/geminid-core';
import { SessionStatsState } from '../contexts/SessionContext.js';

describe('narratorCommand', () => {
  let mockContext: CommandContext;

  beforeEach(() => {
    mockContext = {
      invocation: {
        raw: '',
        name: '',
        args: '',
      },
      services: {
        config: null,
        settings: {} as LoadedSettings,
        git: undefined,
        logger: {} as Logger,
      },
      ui: {
        addItem: vi.fn(),
        clear: vi.fn(),
        setDebugMessage: vi.fn(),
        pendingItem: null,
        setPendingItem: vi.fn(),
        loadHistory: vi.fn(),
        toggleCorgiMode: vi.fn(),
        toggleVimEnabled: vi.fn(),
        setGeminiMdFileCount: vi.fn(),
        reloadCommands: vi.fn(),
        setNarratorMode: vi.fn(),
      },
      session: {
        sessionShellAllowlist: new Set(),
        stats: {} as SessionStatsState,
      },
    };
  });

  it("should set narrator mode to 'off' and add an info message", async () => {
    await narratorCommand.action(mockContext, 'off');
    expect(mockContext.ui.setNarratorMode).toHaveBeenCalledWith('off');
    expect(mockContext.ui.addItem).toHaveBeenCalledWith(
      {
        type: MessageType.INFO,
        text: 'Narrator mode set to: off.',
      },
      expect.any(Number),
    );
  });

  it("should set narrator mode to 'thinking' and add an info message", async () => {
    await narratorCommand.action(mockContext, 'thinking');
    expect(mockContext.ui.setNarratorMode).toHaveBeenCalledWith('thinking');
    expect(mockContext.ui.addItem).toHaveBeenCalledWith(
      {
        type: MessageType.INFO,
        text: 'Narrator mode set to: thinking.',
      },
      expect.any(Number),
    );
  });

  it("should set narrator mode to 'response' and add an info message", async () => {
    await narratorCommand.action(mockContext, 'response');
    expect(mockContext.ui.setNarratorMode).toHaveBeenCalledWith('response');
    expect(mockContext.ui.addItem).toHaveBeenCalledWith(
      {
        type: MessageType.INFO,
        text: 'Narrator mode set to: response.',
      },
      expect.any(Number),
    );
  });

  it('should add an error message for an invalid mode', async () => {
    await narratorCommand.action(mockContext, 'invalid');
    expect(mockContext.ui.setNarratorMode).not.toHaveBeenCalled();
    expect(mockContext.ui.addItem).toHaveBeenCalledWith(
      {
        type: MessageType.ERROR,
        text: "Invalid narrator mode. Use 'off', 'thinking', or 'response'.",
      },
      expect.any(Number),
    );
  });
});
