/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandKind, SlashCommand } from './types.js';
import { MessageType } from '../types.js';
import { generateAndPlayTts as _generateAndPlayTts } from '../../utils/tts.js';

export const narratorCommand: SlashCommand = {
  name: 'narrator',
  description: 'Sets the narrator mode (off, thinking, response).',
  kind: CommandKind.BUILT_IN,
  action: async (context, args) => {
    const mode = args.trim().toLowerCase();
    if (mode === 'off' || mode === 'thinking' || mode === 'response') {
      context.ui.setNarratorMode(mode);
      context.ui.addItem(
        {
          type: MessageType.INFO,
          text: `Narrator mode set to: ${mode}.`,
        },
        Date.now(),
      );
    } else {
      context.ui.addItem(
        {
          type: MessageType.ERROR,
          text: `Invalid narrator mode. Use 'off', 'thinking', or 'response'.`,
        },
        Date.now(),
      );
    }
  },
};
