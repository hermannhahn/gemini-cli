/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const commitGenerated = join(
  process.cwd(),
  'packages/cli/src/generated/git-commit.ts',
);
const rootPackageJsonPath = join(process.cwd(), 'package.json');
const cliPackageJsonPath = join(process.cwd(), 'packages/cli/package.json');
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

if (currentBranch !== 'hermannhahn/develop' && currentBranch !== 'develop') {
  console.error('This script can only be run on the develop branch.');
  process.exit(1);
}

let newVersion = process.argv[2];
let skipTest = process.argv[3];

const gitCommitFile = readFileSync(commitGenerated, 'utf-8');
const GIT_COMMIT_INFO = gitCommitFile.match(
  /export const GIT_COMMIT_INFO = '(.*)';/,
)[1];

if (!newVersion) {
  console.error('Usage: npm run publish:develop <new_version>');
  process.exit(1);
}

try {
  // Check and update root package.json
  const rootPackageJsonContent = readFileSync(rootPackageJsonPath, 'utf8');
  const rootPackageJson = JSON.parse(rootPackageJsonContent);
  if (rootPackageJson.version !== newVersion) {
    rootPackageJson.version = newVersion;
    writeFileSync(
      rootPackageJsonPath,
      JSON.stringify(rootPackageJson, null, 2) + '\n',
    );
    console.log(`Updated ${rootPackageJsonPath} to version ${newVersion}`);
  } else {
    console.log(`${rootPackageJsonPath} already at version ${newVersion}.`);
  }

  // Check and update packages/cli/package.json
  const cliPackageJsonContent = readFileSync(cliPackageJsonPath, 'utf8');
  const cliPackageJson = JSON.parse(cliPackageJsonContent);
  if (cliPackageJson.version !== newVersion) {
    cliPackageJson.version = newVersion;
    writeFileSync(
      cliPackageJsonPath,
      JSON.stringify(cliPackageJson, null, 2) + '\n',
    );
    console.log(`Updated ${cliPackageJsonPath} to version ${newVersion}`);
  } else {
    console.log(`${cliPackageJsonPath} already at version ${newVersion}.`);
  }

  // Check and update packages/core/package.json
  const corePackageJsonPath = join(process.cwd(), 'packages/core/package.json');
  const corePackageJsonContent = readFileSync(corePackageJsonPath, 'utf8');
  const corePackageJson = JSON.parse(corePackageJsonContent);
  if (corePackageJson.version !== newVersion) {
    corePackageJson.version = newVersion;
    writeFileSync(
      corePackageJsonPath,
      JSON.stringify(corePackageJson, null, 2) + '\n',
    );
    console.log(`Updated ${corePackageJsonPath} to version ${newVersion}`);
  } else {
    console.log(`${corePackageJsonPath} already at version ${newVersion}.`);
  }

  // Update package
  try {
    console.log('Installing dependencies and updating packages...');
    // Install
    execSync('npm install', { stdio: 'inherit' });
    console.log('npm install completed.');
    // Build
    execSync('npm run build', { stdio: 'inherit' });
    console.log('npm run build completed.');
    // Preflight
    if (skipTest === '--skip-tests') {
      console.log('Running preflight checks...');
      execSync('npm run preflight', { stdio: 'inherit' });
      console.log('npm run preflight completed.');
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

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
      `git commit -m 'chore(release): Develop Review v${newVersion} (${GIT_COMMIT_INFO})'`,
    );
  } else {
    execSync(
      `git commit --allow-empty -m 'chore(release): Develop Review v${newVersion} (${GIT_COMMIT_INFO})'`,
    );
  }

  // Pushing
  execSync('git push origin hermannhahn/develop');
  console.log(`Develop branch v${newVersion} successfully pushed.`);

  // Create Pull Request
  try {
    console.log('Creating Pull Request...');
    execSync(
      `gh pr create --base hermannhahn/main --head hermannhahn/develop --title "chore(release): Develop Review v${newVersion} (${GIT_COMMIT_INFO})" --body "Automated PR for develop branch."`,
      { stdio: 'inherit' }
    );
    console.log('Pull Request created successfully.');
  } catch (prError) {
    console.error('Error creating Pull Request:', prError.message);
    // Do not exit here, as the push was successful.
    // The user can manually create the PR if this step fails.
  }
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}

process.exit(0);
