/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { narratorCommand } from './narratorCommand';
import { CommandContext } from './types';

describe('narratorCommand', () => {
  it('should set narrator mode to "thinking" when --narrator is passed without a value', () => {
    const setNarratorModeMock = vi.fn();
    const mockCommandContext: CommandContext = {
      ui: {
        setNarratorMode: setNarratorModeMock,
      },
    } as unknown as CommandContext; // Cast to CommandContext to satisfy type checking

    narratorCommand.action(mockCommandContext, 'thinking');
    expect(setNarratorModeMock).toHaveBeenCalledWith('thinking');
  });

  it('should set narrator mode to the provided value when --narrator is passed with a value', () => {
    const setNarratorModeMock = vi.fn();
    const mockCommandContext: CommandContext = {
      ui: {
        setNarratorMode: setNarratorModeMock,
      },
    } as unknown as CommandContext;

    narratorCommand.action(mockCommandContext, 'off');
    expect(setNarratorModeMock).toHaveBeenCalledWith('off');
  });

  it('should not change narrator mode when --narrator is not passed', () => {
    const setNarratorModeMock = vi.fn();
    const mockCommandContext: CommandContext = {
      ui: {
        setNarratorMode: setNarratorModeMock,
      },
    } as unknown as CommandContext;

    narratorCommand.action(mockCommandContext, '');
    expect(setNarratorModeMock).not.toHaveBeenCalled();
  });
});
