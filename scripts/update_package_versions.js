/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const rootPackageJsonPath = join(process.cwd(), 'package.json');
const cliPackageJsonPath = join(process.cwd(), 'packages/cli/package.json');
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

if (currentBranch !== 'hermannhahn/main' && currentBranch !== 'main') {
  console.error('This script can only be run on the main branch.');
  process.exit(1);
}

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Usage: npm run publish <new_version>');
  process.exit(1);
}

try {
  // Configure Git User for the commit
  execSync('git config user.name "github-actions[bot]"');
  execSync(
    'git config user.email "github-actions[bot]@users.noreply.github.com"',
  );

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

  // Check if any other files were modified
  const modifiedFiles = execSync('git status --porcelain').toString().trim();
  // List of file (Ignore M char, the first file is not a file);
  const modifiedFilesToAdd = modifiedFiles
    .split('\n')
    .map((line) => line.substring(2))
    .join(' ');

  if (modifiedFiles) {
    console.log('Files were modified since the last commit:');
    console.log(modifiedFiles);
    console.log('Installing dependencies and updating packages...');
    // Install
    execSync('npm install', { stdio: 'inherit' });
    console.log('npm install completed.');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('npm run build completed.');
    // Get all modified files names

    // Add changes to git
    execSync(`git add ${modifiedFilesToAdd}`); // Be specific about files
    console.log('Added all changes to git staging area.');
    // Commit
    execSync(`git commit -m 'chore(release): Release v${newVersion}'`);
  } else {
    execSync(
      `git commit --allow-empty -m 'chore(release): Release v${newVersion}'`,
    );
    console.log(`Re-triggering release workflow for version ${newVersion}.`);
  }

  // Pushing (always push, even if no new commit was made, to trigger CI/CD for other changes)
  console.log(`Created commit for version ${newVersion}.`);
  console.log('Version update process complete.');
  console.log('Publishing and triggering release workflow...');
  execSync('git push origin hermannhahn/main');
  console.log(
    `Version ${newVersion} successfully published and triggered release workflow.`,
  );
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}
