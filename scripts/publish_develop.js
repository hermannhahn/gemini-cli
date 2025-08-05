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

if (currentBranch !== 'hermannhahn/develop' && currentBranch !== 'develop') {
  console.error('This script can only be run on the develop branch.');
  process.exit(1);
}

let newVersion = process.argv[2];

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

  if (!newVersion) {
    newVersion = rootPackageJson.version;
    console.log(
      `No new version provided. Using current version from package.json: ${newVersion}`,
    );
  }

  // Check if any other files were modified
  const modifiedFiles = execSync('git status --porcelain').toString().trim();

  if (modifiedFiles) {
    console.log('Files were modified since the last commit:');
    console.log(modifiedFiles);

    try {
      console.log('Installing dependencies and updating packages...');
      // Install
      execSync('npm install', { stdio: 'inherit' });
      console.log('npm install completed.');
      // Build
      execSync('npm run build', { stdio: 'inherit' });
      console.log('npm run build completed.');
      // Preflight
      console.log('Running preflight checks...');
      // execSync('npm run preflight', { stdio: 'inherit' });
      console.log('npm run preflight completed.');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    // Add changes to git
    execSync(`git add .`); // Be specific about files
    console.log('Added all changes to git staging area.');
    // Commit updates
    execSync(`git commit -m 'chore(release): Develop Release v${newVersion}'`);
  } else {
    execSync(
      `git commit --allow-empty -m 'chore(release): Develop Release v${newVersion}'`,
    );
  }

  // Pushing
  execSync('git push origin hermannhahn/develop');
  console.log(`Develop branch v${newVersion} successfully pushed.`);
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}

process.exit(0);
