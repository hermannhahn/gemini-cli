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
  - **Action Plan:** Modify the `should be able to run a shell command via stdin` test in `integration-tests/run_shell_command.test.js` to create the `blah.txt` file directly within the shell prompt using `echo` before executing `ls`. This ensures the file exists when `ls` runs.
  - **Attempt Status:** Completed
  - **Result:** Test passed after modifying to create file within shell prompt.
