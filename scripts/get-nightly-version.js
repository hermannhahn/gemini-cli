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

  const now = new Date();
  const year = now.getUTCFullYear().toString().slice(-2);
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = now.getUTCDate().toString().padStart(2, '0');
  const date = `${year}${month}${day}`;
  const sha = getShortSha();

  let releaseTag = `v${version}-nightly.${date}.${sha}`;

  const releaseVersion = `${version}-nightly-${date}-${sha}`;
  let npmTag = 'nightly';
  if (releaseVersion.includes('-')) {
    npmTag = releaseVersion.split('-')[1].split('.')[0];
  }

  return { releaseTag, releaseVersion, npmTag };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    const versions = getNightlyTagName();
    console.log(JSON.stringify(versions));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
