/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as path from 'path';
import * as os from 'os';

export const GEMINI_CLI_DIR = '.gemini';
export const COMMANDS_DIR_NAME = 'commands';

export function getUserCommandsDir(): string {
  return path.join(os.homedir(), GEMINI_CLI_DIR, COMMANDS_DIR_NAME);
}

export function getProjectCommandsDir(projectRoot: string): string {
  return path.join(projectRoot, GEMINI_CLI_DIR, COMMANDS_DIR_NAME);
}
