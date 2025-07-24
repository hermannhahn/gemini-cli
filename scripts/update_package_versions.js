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

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Usage: node scripts/update_package_versions.js <new_version>');
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

  // Add changes to git
  execSync('git add package.json packages/cli/package.json');
  console.log('Added package.json files to git staging area.');

  // Commit the version update
  execSync(`git commit -m "chore: Release ${newVersion}"`);
  console.log(`Created commit for version ${newVersion}.`);

  // Create and push the tag
  execSync(`git tag v${newVersion}`);
  console.log(`Created tag v${newVersion}.`);

  console.log('Version update and tagging complete.');
} catch (error) {
  console.error('Error during version update:', error.message);
  process.exit(1);
}
