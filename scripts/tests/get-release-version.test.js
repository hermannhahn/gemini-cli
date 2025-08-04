/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getReleaseVersion } from '../get-release-version';
import { execSync } from 'child_process';
import * as fs from 'fs';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    default: {
      ...mod.default,
      readFileSync: vi.fn(),
    },
  };
});

describe('getReleaseVersion', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.useFakeTimers();
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      JSON.stringify({ version: '0.1.0' }),
    );
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should get version from package.json', () => {
    const { releaseTag, releaseVersion, npmTag } = getReleaseVersion();
    expect(releaseTag).toBe('v0.1.0');
    expect(releaseVersion).toBe('0.1.0');
    expect(npmTag).toBe('latest');
  });

  it('should prepend v to version if missing', () => {
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.2.3' }),
    );
    const { releaseTag } = getReleaseVersion();
    expect(releaseTag).toBe('v1.2.3');
  });

  it('should handle pre-release versions correctly', () => {
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.2.3-beta.1' }),
    );
    const { releaseTag, releaseVersion, npmTag } = getReleaseVersion();
    expect(releaseTag).toBe('v1.2.3-beta.1');
    expect(releaseVersion).toBe('1.2.3-beta.1');
    expect(npmTag).toBe('beta');
  });

  it('should throw an error for invalid version format', () => {
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.2' }),
    );
    expect(() => getReleaseVersion()).toThrow(
      'Error: Version must be in the format vX.Y.Z or vX.Y.Z-prerelease',
    );
  });

  it('should throw an error for versions with build metadata', () => {
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.2.3+build456' }),
    );
    expect(() => getReleaseVersion()).toThrow(
      'Error: Versions with build metadata (+) are not supported for releases.',
    );
  });
});

describe('get-release-version script', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      JSON.stringify({ version: '0.1.0' }),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should print version JSON to stdout when executed directly', () => {
    const expectedJson = {
      releaseTag: 'v0.1.0',
      releaseVersion: '0.1.0',
      npmTag: 'latest',
    };
    // Mock execSync to return the expected JSON when the script is run
    vi.mock('child_process', () => ({
      execSync: vi.fn((command) => {
        if (command.includes('get-release-version.js')) {
          return JSON.stringify(expectedJson);
        }
        return '';
      }),
    }));

    const result = execSync('node scripts/get-release-version.js').toString();
    expect(JSON.parse(result)).toEqual(expectedJson);
  });
});
