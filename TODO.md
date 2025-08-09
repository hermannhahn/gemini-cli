# TODO

This file lists tasks and their progress.

## Error: `npm start` and global `geminid` command not working simultaneously

**General Status:** Resolved

**Main Objective:** Ensure both `npm start` for local development and global `geminid` command work correctly.

### Resolution Attempts:

- **Resolution Attempt 1:**
  - **Action Plan:** Identified that `release/0.1.28` had `npm start` working but not global `geminid`, while `release/0.1.31` had global `geminid` working but not `npm start`. The issue was a conflict in `bin` field definitions and `main` field usage across root and `packages/cli/package.json`, and missing `external` in `esbuild.config.js`.
  - **Attempt Status:** Completed
  - **Result:**
    - Removed `bin` from `packages/cli/package.json`.
    - Ensured `bin` in root `package.json` points to `bundle/geminid.js`.
    - Ensured `main` in root `package.json` points to `bundle/geminid.js`.
    - Ensured `external: ['@hahnd/gemini-cli-core']` is present in `esbuild.config.js`.
    - Both `npm start` and global `geminid` command are now working as expected.

## Error: `gh pr create` fails with "No default remote repository has been set"

**General Status:** Resolved

**Main Objective:** Ensure the `gh pr create` command in `scripts/publish_develop.js` successfully creates a Pull Request.

### Resolution Attempts:

- **Resolution Attempt 1:**
  - **Action Plan:** Modified `scripts/publish_develop.js` to include `--repo hermannhahn/gemini-cli` in the `gh pr create` command, explicitly specifying the repository.
  - **Attempt Status:** Completed
  - **Result:** The `gh pr create` command should now execute successfully without the "No default remote repository has been set" error.

## Preflight Checks

- **General Status**: Completed
- **Main Objective**: Ensure the project builds, lints, and tests pass successfully.
- **Resolution Attempts**:
  - **Attempt 1**:
    - **Action Plan**: Executed `npm run preflight`.
    - **Attempt Status**: Completed
    - **Result**: All preflight checks passed successfully.

## Completed Tasks
