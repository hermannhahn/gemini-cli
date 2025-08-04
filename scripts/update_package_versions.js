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

function updatePackageJson(filePath, version) {
  const packageJson = JSON.parse(readFileSync(filePath, 'utf8'));
  packageJson.version = version;
  writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Updated ${filePath} to version ${version}`);
}

try {
  // Update versions in package.json files
  updatePackageJson(rootPackageJsonPath, newVersion);
  updatePackageJson(cliPackageJsonPath, newVersion);

  // install and compile
  console.log('Installing...');
  execSync('npm install');
  console.log('Compiling...');
  execSync('npm run build');
  console.log('Succefully installed and compiled Geminid CLI v' + newVersion);

  // Add changes to git
  execSync('git add .');
  console.log('Added package.json files to git staging area.');

  // Commit the version update
  execSync(`git commit -m 'chore: Release v${newVersion}'`);
  console.log(`Created commit for version ${newVersion}.`);

  console.log('Version update and tagging complete.');

  // Pushing
  console.log('Publishing...');
  execSync('git push');
  console.log(`Version ${newVersion} successfully published.`);
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}
