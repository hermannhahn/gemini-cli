/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const commandArg = process.argv[2];

function run(command) {
  try {
    console.log(`> ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`🛑 Error running ${command}: \n⚠️`, error.message);
    process.exit(1);
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();
const currentBranchType = currentBranch.split('/')[1];
const currentCommitType = currentBranch.split('/')[2];

if (
  !currentBranch.includes('main') &&
  !currentBranch.includes('release') &&
  !currentBranch.includes('develop')
) {
  // Starting publishing into development branch
  console.log('🏁 Starting publishing into development branch...');
  console.log(`📦 Current branch: ${currentBranch}`);
  console.log(`🛠️ Current branch type: ${currentBranchType}`);
  console.log(`📝 Current commit type: ${currentCommitType}`);

  // If is new version
  if (commandArg && commandArg !== 'skip-test') {
    run(`node scripts/version.js ${commandArg}`);
  }

  // Clean
  console.log('🗑️ Cleaning up...');
  run('rm -rf node_modules package-lock.json');
  console.log('✅ Successfully cleaned up.');

  // Install
  console.log('📥 Installing packages...');
  run('npm install');
  console.log('✅ Successfully installed packages.');

  // Build package
  console.log('🛠️ Building packages...');
  run('npm run build');
  console.log('✅ Successfully built packages.');

  // Preflight
  if (commandArg !== 'skip-test') {
    console.log('📋 Running preflight checks...');
    run('npm run preflight');
    console.log('✅ Preflight checks successfully completed.');
  }

  // Get version
  const rootPackageJsonPath = resolve(process.cwd(), 'package.json');
  const version = readJson(rootPackageJsonPath).version;

  // Commit
  const GIT_COMMIT_INFO = execSync('node scripts/generate-git-commit-info.js', {
    encoding: 'utf-8',
  }).trim();
  console.log('📝 Generated git commit info.');
  console.log('✒️ Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(
    `git commit --allow-empty -m "${currentBranchType}(${currentCommitType}): Development Release v${version} - ${GIT_COMMIT_INFO}"`,
    { stdio: 'inherit' },
  );
  console.log('✅ Successfully committed changes.');

  // Checkout to development branch
  console.log('🔁 Checking out to development branch...');
  execSync('git checkout hermannhahn/develop', { stdio: 'inherit' });

  // Merge into development branch
  console.log('🔀 Merging into development branch...');
  execSync(
    `git merge ${currentBranch} --no-ff -m "${currentBranchType}(${currentCommitType}): Development Release v${version} - ${GIT_COMMIT_INFO}"`,
    {
      stdio: 'inherit',
    },
  );
  console.log('✅ Successfully merged into development branch.');

  // delete feature/fix branch
  console.log(`⛔ Deleting ${currentBranch} branch...`);
  execSync(`git branch -D ${currentBranch}`, { stdio: 'inherit' });
  console.log(`✅ Successfully deleted ${currentBranch} branch.`);

  // Push to development branch
  console.log('📤 Pushing to development branch...');
  execSync('git push origin hermannhahn/develop', { stdio: 'inherit' });
  console.log('✅ Successfully pushed to development branch.');

  // Create Pull Request
  try {
    console.log('📝 Creating Pull Request...');
    execSync(
      `gh pr create --repo hermannhahn/gemini-cli --base hermannhahn/main --head hermannhahn/develop --title "chore(release): Develop Review v${version}" --body "Automated PR for develop branch: ${GIT_COMMIT_INFO}"`,
      { stdio: 'inherit' },
    );
    console.log('✅ Pull Request created successfully.');
  } catch (prError) {
    console.error('🛑 Error creating Pull Request:', prError.message);
    // Do not exit here, as the push was successful.
    // The user can manually create the PR if this step fails.
  }
  console.log(
    `✅ Successfully pushed version ${version} to develop branch and PR created.`,
  );
} else {
  console.error('🛑 This script can only be run on the feature or fix branch.');
  process.exit(1);
}

process.exit(0);
// END
