/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandKind, SlashCommand } from './types.js';

export const narratorCommand: SlashCommand = {
  name: 'narrator',
  description:
    'Toggles narrator mode (off,`thinking`, response). Usage: /narrator [off|thinking|response]',
  kind: CommandKind.BUILT_IN,
  action: async (commandContext, args) => {
    const mode = args.toLowerCase();
    if (mode === 'off' || mode === 'thinking' || mode === 'response') {
      commandContext.ui.setNarratorMode(mode);
      return {
        type: 'message',
        messageType: 'info',
        content: `Narrator mode set to: ${mode}`,
      };
    } else {
      return {
        type: 'message',
        messageType: 'error',
        content: 'Invalid narrator mode. Use /narrator [off|thinking|response]',
      };
    }
  },
};
