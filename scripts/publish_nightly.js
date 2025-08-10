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
  execSync('git checkout hermannhahn/main');
  console.log('Switched to hermannhahn/main branch.');
}

let releaseVersion = undefined;

try {
  // Pull
  execSync('git pull');
  console.log('Pulled hermannhahn/main branch.');

  // Check and update root package.json
  const rootPackageJsonContent = readFileSync(rootPackageJsonPath, 'utf8');
  const rootPackageJson = JSON.parse(rootPackageJsonContent);
  releaseVersion = rootPackageJson.version;
  console.log(`Releasing ${rootPackageJsonPath} version ${releaseVersion}`);

  try {
    // Checkout
    execSync('git checkout hermannhahn/nightly-release');
    console.log('Switched to hermannhahn/nightly-release branch.');
    // Pull
    execSync('git pull');
    console.log('Pulled hermannhahn/nightly-release branch.');
    // merge
    execSync(
      `git merge origin/hermannhahn/main --no-ff -m "chore(release): Nightly Release v${releaseVersion}"`,
    );
    execSync('git push origin hermannhahn/nightly-release');
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
