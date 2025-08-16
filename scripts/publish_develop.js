/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const commandArg = process.argv[2];

function run(command) {
  try {
    // console.log(`> ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`🛑 Error running ${command}: \n⚠️`, error.message);
    process.exit(1);
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

console.log('🏁 Starting publishing into development branch...');

console.log(`🔎 Checking current branch...`);
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();
const currentBranchType = currentBranch.split('/')[1];
const currentCommitType = currentBranch.split('/')[2];
const currentCommitInfo =
  currentBranch.split('/')[1] + ' ' + currentBranch.split('/')[2];

if (
  !currentBranch.includes('main') &&
  !currentBranch.includes('release') &&
  !currentBranch.includes('develop')
) {
  // Starting publishing into development branch
  console.log(`📦 Current branch: ${currentBranch}`);
  console.log(`🛠️  Current branch type: ${currentBranchType}`);
  console.log(`📝 Current commit type: ${currentCommitType}`);

  // If is new version
  if (commandArg && commandArg !== 'skip-test') {
    // Bump version
    if (commandArg !== 'test') {
      console.log('🔢 Bumping version...');
      run(`node scripts/version.js ${commandArg}`);
      console.log('✅ Successfully bumped version.');
      // Clean
      console.log('🗑️ Cleaning up...');
      run('rm -rf node_modules package-lock.json');
      console.log('✅ Successfully cleaned up.');
    }
  }

  // Install
  console.log('📥 Installing packages...');
  run('npm install');
  console.log('✅ Successfully installed packages.');

  // Build package
  console.log('🛠️  Building packages...');
  run('npm run build');
  console.log('✅ Successfully built packages.');

  // Preflight
  if (commandArg !== 'skip-test') {
    console.log('📋 Running preflight checks...');
    run('npm run preflight');
    console.log('✅ Preflight checks successfully completed.');
  }

  // npm global uninstall
  console.log('🗑️ Uninstalling previous global package...');
  run('npm uninstall -g @hahnd/geminid');
  console.log('✅ Successfully uninstalled previous global package.');

  // npm install
  console.log('📥 Installing global package...');
  run('npm install -g .');
  console.log('✅ Successfully installed global package.');

  // Test
  if (commandArg === 'test') {
    // Test
    console.log('🧪 Running test...');
    run('geminid -p "Test 1 2 3..."');
    process.exit(0);
  }

  // Get version
  const rootPackageJsonPath = resolve(process.cwd(), 'package.json');
  const version = readJson(rootPackageJsonPath).version;

  // Commit
  run('node scripts/generate-git-commit-info.js');
  const commitGenerated = join(
    process.cwd(),
    'packages/cli/src/generated/git-commit.ts',
  );
  const gitCommitFile = readFileSync(commitGenerated, 'utf-8');
  const GIT_COMMIT_INFO = gitCommitFile.match(
    /export const GIT_COMMIT_INFO = '(.*)';/,
  )[1];
  console.log('📝 Generated git commit info.');
  console.log('✒️ Committing changes...');
  run('git add .');
  run(
    `git commit --allow-empty -m "${currentBranchType}(${currentCommitType}): Release v${version} - ${GIT_COMMIT_INFO}"`,
  );
  console.log('✅ Successfully committed changes.');

  // Checkout to development branch
  console.log('🔁 Checking out to development branch...');
  run('git checkout hermannhahn/develop');

  // Pull
  console.log('📥 Pulling main branch.');
  run('git pull');
  console.log('✅ Pulled main branch.');

  // Merge into development branch
  console.log('🔀 Merging into development branch...');
  run(
    `git merge ${currentBranch} --no-ff -m "${currentBranchType}(${currentCommitType}): Release v${version} - ${GIT_COMMIT_INFO}"`,
  );
  console.log('✅ Successfully merged into development branch.');

  // delete feature/fix branch
  console.log(`⛔ Deleting ${currentBranch} branch...`);
  run(`git branch -D ${currentBranch}`);
  console.log(`✅ Successfully deleted ${currentBranch} branch.`);

  // Push to development branch
  console.log('📤 Pushing to development branch...');
  run('git push origin hermannhahn/develop');
  console.log('✅ Successfully pushed to development branch.');

  // Create Pull Request
  console.log('📝 Creating Pull Request...');
  run(
    `gh pr create --repo hermannhahn/gemini-cli --base hermannhahn/main --head hermannhahn/develop --title "${currentBranchType}(${currentCommitType}): Release v${version} - ${GIT_COMMIT_INFO}" --body "Automated PR for develop branch: ${currentCommitInfo}"`,
  );
  console.log('✅ Pull Request created successfully.');
  console.log(
    `✅ Successfully pushed version ${version} to develop branch and PR created.`,
  );
} else {
  console.error('🛑 This script can only be run on the feature or fix branch.');
  process.exit(1);
}

process.exit(0);
// END
