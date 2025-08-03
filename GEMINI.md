# Project Instructions for Development

Project Name: Gemini Dev CLI.
Description: This project is a public fork of the Gemini CLI. The user uses this project to interact with me. All code changes must be compiled, tested, and require the user to restart the CLI. Only after the user confirms the restart can we check and test my modifications in this CLI.

## Documentation

**Keep updated** these files before committing:

- [CHANGELOG.md](./CHANGELOG.md)
- [TODO.md](./TODO.md)
- [README.md](./README.md)

## Essential Guides

**Always read** these files before thinking about a solution or action plan.

For details on project development and workflow, consult the following files:

- **[DEVELOPMENT.md](./DEVELOPMENT.md)**: Contains detailed instructions on the development environment, code quality, testing, debugging, sandboxing, and the release process.
- **[WORKFLOW.md](./WORKFLOW.md)**: Describes the development workflow, including branching strategies, upstream synchronization, feature development, hotfixes, and the release process.

## Project Test Instructions

This project's tests need to be run with "npm run preflight", but first, I must compile with "npm run build" and fix all errors.

## Context Management Instruction

The `TODO.md` file is the primary, detailed source of task progress, including status. The memory (STM) will be used exclusively for meta-instructions and non-temporal instructions on how to manage the context, not for direct task details.

**Crucially** I will always save a summary of the session to memory (STM) stating what was done and what I need to do in the next session at end of session or if I ask to restart cli.

**Crucially** I will delete memories about previous or old attempts and save new one updated.

## Error Management Instruction

**Error Resolution Flow: When resolving an error in the user's project code, I must strictly follow this sequence of steps, ensuring that `TODO.md` is updated at each point**:

1.  **Analyze `TODO.md`**: I will read the error section in `TODO.md`, focusing on the 'General Status' and 'Resolution Attempts' to understand the progress and previous results.
2.  **Register New Error**: If the error is not in `TODO.md`, I will create a new section for it, including 'General Status' as 'In Progress', 'Main Objective', and the first 'Resolution Attempt' with 'Attempt Status' as 'In Progress'.
3.  **Check Last Attempt**: If the error is already in `TODO.md`, I will check the last registered 'Resolution Attempt'.
4.  **Define Next Step**: If the last 'Resolution Attempt' is 'Completed' but the error persists, I will add a new 'Resolution Attempt' with a new 'Action Plan' and 'Attempt Status' as 'In Progress'.
5.  **Execute Action Plan**: If the 'Attempt Status' of the last 'Resolution Attempt' is 'In Progress', I will execute the 'Action Plan' described therein.
6.  **Update Status (Awaiting Compilation)**: After executing the 'Action Plan', I will update the 'Result' of the 'Resolution Attempt' and change the 'Attempt Status' to 'Awaiting Compilation'.
7.  **Compile Project**: I will execute "npm run build". If the compilation fails, I will update the 'Result' of the 'Resolution Attempt' to 'Compilation Failed', add a new 'Resolution Attempt' with a new 'Action Plan' to fix it, and change the 'Attempt Status' to 'In Progress'.
8.  **Update Status (Awaiting Tests)**: After successful compilation, I will update the 'Result' of the 'Resolution Attempt' to 'Compilation Successful' and change the 'Attempt Status' to 'Awaiting Tests'.
9.  **Await User**: After successful build, I will update the 'Result' of the 'Resolution Attempt' to 'Build Successful' and change the 'Attempt Status' to 'Awaiting User'. I will instruct the user to restart the CLI and VS Code, if necessary. I will not test the modifications before the user confirms the restart, even if the build not fail.
10. **Update Status (In Progress - Tests)**: If the user confirms the CLI restart and the 'Attempt Status' is 'Awaiting User', I will update the 'Attempt Status' to 'In Progress' to start the tests.
11. **Test Modifications**: If the 'Attempt Status' of the last 'Resolution Attempt' is 'In Progress' (for tests), I will test the modifications. If it's a tool, I will try to use it. After the test, I will update the 'Result' and, if the error is resolved, I will change the 'General Status' of the error to 'Resolved' and the 'Attempt Status' to 'Completed'. Otherwise, I will add a new 'Resolution Attempt' with a new 'Action Plan' and 'Attempt Status' as 'In Progress'.
12. **Repeat Flow**: I will repeat this flow with new plan of action as necessary and if objectives are not met.
13. **Execute Tests (Preflight)**: I will execute "npm run preflight" only if the errors are solved and objectives are met. If the tests fail, I will update the 'Result' of the 'Resolution Attempt' to 'Tests Failed', add a new 'Resolution Attempt' with a new 'Action Plan' to fix it, and change the 'Attempt Status' to 'In Progress'. If the problem is solved I will clean TODO.md section about this problem.

## Project Settings

**File Import** To import .ts files in this project I must to use .js instead of .ts
**Release** This project auto release after tag creation.

## Technical and Importation Conclusions for Gemini CLI Project:

1.  **Internal Module Imports (`.js` instead of `.ts`):**
    - When importing TypeScript modules (`.ts`) within the project (especially in test files or where the bundler has already processed the files), it is **mandatory to use the `.js` extension** in the import path, even if the original file is `.ts`. This is due to the compilation process and how modules are resolved at runtime.
    - **Example:** Instead of `import { someFunction } from '../utils/myModule.ts';`, use `import { someFunction } from '../utils/myModule.js';`.

2.  **`@hahnd/gemini-cli-core` Package Imports:**
    - Modules and functionalities from the `@hahnd/gemini-cli-core` package must be imported directly from the package, not via relative paths that attempt to access the internal structure of the `core`.
    - **Example:** Instead of `import { Config } from '../../../core/src/config/config.js';`, use `import { Config } from '@hahnd/gemini-cli-core';`.

3.  **Mocking Context Functions (`commandContext.ui`):**
    - When testing CLI commands that interact with the UI (e.g., `commandContext.ui.setNarratorMode`), it is necessary to mock these functions to isolate the test and avoid dependencies on the actual UI.
    - Use `vi.spyOn` or similar mocks to simulate the behavior of these functions and verify that they were called correctly.

4.  **Command Structure (`.action` vs. `.handler`):**
    - The main function of a CLI command (like `/narrator`) is exposed through the `.action` property of the command object, not `.handler`. This is crucial for correctly invoking the command's logic in tests.

5.  **Argument Passing for Commands:**
    - When testing commands that expect arguments (e.g., `/narrator [mode]`), ensure that the arguments are passed in the format and type expected by the command's `action` function. In the case of `narratorCommand.action`, `args` is a string.

6.  **Argument Order in Tests:**
    - Pay attention to the order of arguments passed to test functions and mocks. Small inconsistencies in the order can lead to type errors or unexpected behavior.
