/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { join } from 'path';
import { execSync } from 'child_process';

const commandArg = process.argv[2];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const commitGenerated = join(
  process.cwd(),
  'packages/cli/src/generated/git-commit.ts',
);
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

if (
  !currentBranch.includes('main') &&
  !currentBranch.includes('release') &&
  !currentBranch.includes('develop')
) {
  if (currentBranch !== currentBranch.includes('develop')) {
    // Preflight
    if (commandArg !== 'skip-test') {
      console.log('Running preflight checks...');
      try {
        execSync('npm run preflight', { stdio: 'inherit' });
      } catch (preflightError) {
        console.error(preflightError.message);
        console.error(
          'Preflight checks failed. Please, fix the error(s) and try again!',
        );
        process.exit(1);
      }
      console.log('Preflight checks successfully completed.');
    }

    // Merge with development branch
    try {
      execSync('git merge origin/hermannhahn/develop --no-ff', {
        stdio: 'inherit',
      });
      // checkout to develop
      execSync('git checkout hermannhahn/develop', { stdio: 'inherit' });
      // delete feature/fix branch
      try {
        execSync(`git branch -D ${currentBranch}`, { stdio: 'inherit' });
      } catch (deleteError) {
        console.error(
          `Error deleting branch ${currentBranch}:`,
          deleteError.message,
        );
      }
    } catch (mergeError) {
      console.error(
        'Error merging with origin/hermannhahn/develop:',
        mergeError.message,
      );
      process.exit(1);
    }
  }
} else {
  console.error('This script can only be run on the feature or fix branch.');
  process.exit(1);
}

if (commandArg && commandArg !== 'skip-test') {
  execSync(`node scripts/version.js ${commandArg}`);
}

try {
  console.log('Installing dependencies and updating packages...');
  // Install
  execSync('npm install', { stdio: 'inherit' });
  console.log('npm install completed.');
  // Build
  execSync('npm run build', { stdio: 'inherit' });
  console.log('npm run build completed.');
} catch (error) {
  console.log(error);
  process.exit(1);
}

const rootPackageJsonPath = resolve(process.cwd(), 'package.json');
const version = readJson(rootPackageJsonPath).version;

const gitCommitFile = readFileSync(commitGenerated, 'utf-8');
const GIT_COMMIT_INFO = gitCommitFile.match(
  /export const GIT_COMMIT_INFO = '(.*)';/,
)[1];
console.log(GIT_COMMIT_INFO);

// Check if any other files were modified
const modifiedFiles = execSync('git status --porcelain').toString().trim();

if (modifiedFiles) {
  console.log('Files were modified since the last commit:');
  console.log(modifiedFiles);

  // Add changes to git
  execSync(`git add .`); // Be specific about files
  console.log('Added all changes to git staging area.');
  // Commit updates
  execSync(
    `git commit -m 'chore(release): Develop Release v${version} (${GIT_COMMIT_INFO})'`,
  );
} else {
  execSync(
    `git commit --allow-empty -m 'chore(release): Develop Release v${version}'`,
  );
}

// Pushing
execSync('git push origin hermannhahn/develop');
console.log(`Develop branch v${version} successfully pushed.`);

// Create Pull Request
try {
  console.log('Creating Pull Request...');
  execSync(
    `gh pr create --repo hermannhahn/gemini-cli --base hermannhahn/main --head hermannhahn/develop --title "chore(release): Develop Review v${version}" --body "Automated PR for develop branch: ${GIT_COMMIT_INFO}"`,
    { stdio: 'inherit' },
  );
  console.log('Pull Request created successfully.');
} catch (prError) {
  console.error('Error creating Pull Request:', prError.message);
  // Do not exit here, as the push was successful.
  // The user can manually create the PR if this step fails.
}
console.log(
  `Successfully pushed version ${version} to develop branch and PR created.`,
);
process.exit(0);
// END
