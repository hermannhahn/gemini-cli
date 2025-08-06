/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const rootPackageJsonPath = join(process.cwd(), 'package.json');
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

if (currentBranch !== 'hermannhahn/main' && currentBranch !== 'main') {
  console.error('This script can only be run on the main branch.');
  process.exit(1);
}

let releaseVersion = undefined;

try {
  // Check and update root package.json
  const rootPackageJsonContent = readFileSync(rootPackageJsonPath, 'utf8');
  const rootPackageJson = JSON.parse(rootPackageJsonContent);
  releaseVersion = rootPackageJson.version;
  console.log(`Releasing ${rootPackageJsonPath} version ${releaseVersion}`);

  try {
    // Pull
    execSync('git pull');
    console.log('Pulled hermannhahn/main branch.');
    // Checkout
    execSync('git checkout hermannhahn/release');
    console.log('Switched to hermannhahn/release branch.');
    // Pull
    execSync('git pull');
    console.log('Pulled hermannhahn/release branch.');
    // merge
    execSync(
      `git merge origin/hermannhahn/main --no-ff -m "chore(release): Release v${releaseVersion}"`,
    );
    execSync('git push origin hermannhahn/release');
    console.log('Succefully triggered release workflow.');
  } catch (error) {
    console.log(error);
  }
  execSync('git checkout hermannhahn/develop');
  console.log('Switched back to hermannhahn/develop branch.');
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}

process.exit(0);
