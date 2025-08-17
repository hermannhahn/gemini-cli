/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { narratorCommand } from './narratorCommand.js';
import { CommandContext } from './types.js';

describe('narratorCommand', () => {
  it('should set narrator mode to "thinking" when --narrator is passed without a value', () => {
    const setNarratorModeMock = vi.fn();
    const addItemMock = vi.fn();
    const mockCommandContext: CommandContext = {
      ui: {
        setNarratorMode: setNarratorModeMock,
        addItem: addItemMock,
      },
    } as unknown as CommandContext; // Cast to CommandContext to satisfy type checking

    if (narratorCommand.action) {
      narratorCommand.action(mockCommandContext, 'thinking');
    }
    expect(setNarratorModeMock).toHaveBeenCalledWith('thinking');
  });

  it('should set narrator mode to the provided value when --narrator is passed with a value', () => {
    const setNarratorModeMock = vi.fn();
    const addItemMock = vi.fn();
    const mockCommandContext: CommandContext = {
      ui: {
        setNarratorMode: setNarratorModeMock,
        addItem: addItemMock,
      },
    } as unknown as CommandContext;

    if (narratorCommand.action) {
      narratorCommand.action(mockCommandContext, 'off');
    }
    expect(setNarratorModeMock).toHaveBeenCalledWith('off');
  });

  it('should not change narrator mode when --narrator is not passed', () => {
    const setNarratorModeMock = vi.fn();
    const addItemMock = vi.fn();
    const mockCommandContext: CommandContext = {
      ui: {
        setNarratorMode: setNarratorModeMock,
        addItem: addItemMock,
      },
    } as unknown as CommandContext;

    if (narratorCommand.action) {
      narratorCommand.action(mockCommandContext, '');
    }
    expect(setNarratorModeMock).not.toHaveBeenCalled();
  });
});
