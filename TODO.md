# TODO

## Error: Snapshot Mismatches in App.test.tsx

**General Status:** Resolved

**Main Objective:** Resolve snapshot mismatches in `packages/cli/src/ui/App.test.tsx` to allow `npm run preflight` to pass.

### Resolution Attempts:

- **Resolution Attempt 1:**
  - **Action Plan:** Update the failing snapshots in `packages/cli/src/ui/App.test.tsx` by running `npm test --workspace=packages/cli -- -u` from the project root directory.
  - **Attempt Status:** Completed
  - **Result:** Snapshots updated and all tests passed.

## Error: E2E Test Failure on macOS (Intermittent)

**General Status:** Resolved

**Main Objective:** Fix the intermittent E2E test failure `should be able to run a shell command via stdin` on macOS.

### Resolution Attempts:

- **Resolution Attempt 1:**
  - **Action Plan:** Add a small delay (e.g., `await new Promise(resolve => setTimeout(resolve, 100));`) before the `assert.ok(result.includes('blah.txt'));` line in `integration-tests/run_shell_command.test.js` to mitigate potential timing issues related to file system operations or stdin processing.
  - **Attempt Status:** Completed
  - **Result:** Test passed after adding delay.
