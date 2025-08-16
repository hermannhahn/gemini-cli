/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function getPackageVersion() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function getShortSha() {
  return execSync('git rev-parse --short HEAD').toString().trim();
}

export function getNightlyTagName() {
  const version = getPackageVersion();

  const sha = getShortSha();
  return `v${version}-nightly.${sha}`;
}

export function getReleaseVersion() {
  const version = getPackageVersion();
  let releaseTag = `v${version}`;

  if (!releaseTag.startsWith('v')) {
    console.error("Version is missing 'v' prefix. Prepending it.");
    releaseTag = `v${releaseTag}`;
  }

  if (releaseTag.includes('+')) {
    throw new Error(
      'Error: Versions with build metadata (+) are not supported for releases. Please use a pre-release version (e.g., v1.2.3-alpha.4) instead.',
    );
  }

  if (!releaseTag.match(/^v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$/)) {
    throw new Error(
      'Error: Version must be in the format vX.Y.Z or vX.Y.Z-prerelease',
    );
  }

  const releaseVersion = releaseTag.substring(1);
  let npmTag = 'latest';
  if (releaseVersion.includes('-')) {
    npmTag = releaseVersion.split('-')[1].split('.')[0];
  }

  return { releaseTag, releaseVersion, npmTag };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    const versions = getReleaseVersion();
    console.log(JSON.stringify(versions));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
