/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

function run(command) {
  try {
    console.log(`> ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`🛑 Error running ${command}: \n⚠️`, error.message);
    process.exit(1);
  }
}

const rootPackageJsonPath = join(process.cwd(), 'package.json');
let currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

// Starting release
console.log('🏁 Starting release...');

if (!currentBranch.includes('main')) {
  run('git checkout hermannhahn/main');
  currentBranch = 'hermannhahn/main';
}
console.log(`📦 Current branch: ${currentBranch}`);

let releaseVersion = undefined;

// Pull
console.log('📥 Pulling main branch.');
run('git pull');
console.log('✅ Pulled main branch.');

// Check and update root package.json
const rootPackageJsonContent = readFileSync(rootPackageJsonPath, 'utf8');
const rootPackageJson = JSON.parse(rootPackageJsonContent);
releaseVersion = rootPackageJson.version;
console.log(`📦 Releasing version ${releaseVersion}`);

// Checkout
console.log('🔁 Checking out to release branch...');
run('git checkout hermannhahn/release');
// Pull
console.log('📥 Pulling release branch.');
run('git pull');
console.log('✅ Pulled release branch.');
// merge
console.log('🔀 Merging main into release branch...');
run(
  `git merge origin/hermannhahn/main --no-ff -m "chore(release): Release v${releaseVersion}"`,
);
console.log('✅ Successfully merged main into release branch.');

// Push
console.log('📤 Pushing release branch.');
run('git push origin hermannhahn/release');
console.log('✅ Successfully pushed release branch.');

// Checkout to develop branch
console.log('🔁 Checking out to develop branch...');
execSync('git checkout hermannhahn/develop');

// Trigger release workflow
console.log('✅ Succefully triggered release workflow.');
process.exit(0);
