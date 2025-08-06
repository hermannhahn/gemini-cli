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
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  // Fetch
  try {
    execSync('git fetch origin hermannhahn/release');
  } catch (error) {
    // if error is fatal: couldn't find remote ref hermannhahn/release
    if (error.message.includes("couldn't find remote ref")) {
      // fetch -u
      execSync('git fetch -u origin hermannhahn/release');
    }
  }

  try {
    // Pull
    execSync('git pull origin hermannhahn/main');
    console.log('Pulled hermannhahn/main branch.');
    // Merge with hermannhahn/release branch
    execSync('git checkout hermannhahn/release');
    console.log('Switched to hermannhahn/release branch.');
    // merge
    execSync(
      `git merge origin/hermannhahn/main --no-ff -m "chore(release): Release v${newVersion}"`,
    );
    execSync('git push origin hermannhahn/release');
    console.log('Succefully triggered release workflow.');
  } catch (error) {
    console.log(error);
    // re-create
    try {
      execSync('git branch -D hermannhahn/release');
      console.log('Deleted hermannhahn/release branch.');
      execSync('git checkout -b hermannhahn/release');
      console.log('Created hermannhahn/release branch.');
      execSync('git push --set-upstream origin hermannhahn/release');
      console.log('Succefully triggered release workflow.');
    } catch (error) {
      console.log(error);
    }
  }
  execSync('git checkout hermannhahn/develop');
  console.log('Switched back to hermannhahn/develop branch.');
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}

process.exit(0);
