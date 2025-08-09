# Gemini Dev CLI

This document provides essential context and instructions for the team assisting in the development of the **Gemini Dev CLI**. This project is a personal fork of the official Gemini CLI. This project was created by Hermann Hahn and is focused on custom modifications and improvements while maintaining compatibility for upstream updates.

## Git Repository

- **Branching Strategy:**
  - `main`: Upstream base (mirror of official `google-gemini/gemini-cli`) to receive google updates.
  - `username/develop`: Development branch for receive feat/hotfix merges, user interface tests and preflight before create PR to `username/main`.
  - `username/feat/feature-name` or `username/hotfix/hotfix-name`: Feature/fix development branches, starded from `username/develop` and merged into `username/develop` upon completion and no preflight errors.
  - `username/main`: Production branch used for Releases and automated Nightly Releases. Only stable and tested features or fixes are merged here from `username/develop`. Requires `username/develop` successful preflight and updated documentation before create PR to `username/main`.
  - `username/release`: Release branch used for automated trigger CI, E2E tests, tag creation and publishing new versions on GitHub Releases and NPM. Only stable features are merged here from `username/main`.
- **Multi-line Commit Messages:**
  - For multi-line commit messages, use multiple `-m` flags in the `git commit` command. Each `-m` flag represents a new line in the commit message if needed.
  - Example: `git commit -m 'Subject line' -m 'Body line 1' -m 'Body line 2'`

## Development Instructions

- **Development Environment:** Developers uses `npm start` for development. Code changes require recompilation and CLI restart for testing.
- **ToolResult Handling:**
  - `llmContent`: Always sent to the AI model for processing. Never suppressed.
  - `returnDisplay`: Used for terminal display. Suppressed if necessary to keep a clean output.
- **Code Quality & Standards:**
  - **Build & Test:** Always run `npm run preflight` and fix errors before committing to validate changes (build, test, typecheck, lint).
  - **Testing:** Use Vitest. Test files (`*.test.ts`, `*.test.tsx`) are co-located with source. Follow existing mocking patterns (`vi.mock`, `vi.fn`, `vi.spyOn`).
  - **JavaScript/TypeScript:**
    - Prefer plain JavaScript objects with TypeScript interfaces/types over classes.
    - Use ES module syntax (`import`/`export`) for encapsulation (private/public APIs).
    - Avoid `any` types; prefer `unknown` with type narrowing.
    - Embrace JavaScript array operators (`.map`, `.filter`, etc.) for immutability and readability.
  - **React (CLI UI - Ink):**
    - Use functional components with Hooks (`useState`, `useReducer`, `useEffect`).
    - Components must be pure and side-effect-free during rendering (side effects in `useEffect` or event handlers).
    - Update state immutably.
    - Follow Rules of Hooks (unconditional calls at top level).
    - Use `useRef` only when necessary.
    - Prefer composition and small components.
    - Optimize for concurrency (code works if component runs multiple times).
    - Optimize for network waterfalls (parallel fetching, Suspense).
    - Rely on React Compiler (avoid manual `useMemo`, `useCallback`, `React.memo` if compiler is enabled).
    - Design for good user experience (minimal UI states, graceful error handling).
- **Comments Policy:** Only high-value comments, explaining _why_. Avoid conversational comments.
- **General Style:** Use hyphens for flag names (e.g., `my-flag`).

## Release Process (Automated via GitHub Actions)

### Standard and Nightly Releases

1. **Decide New Version:** Determine `MAJOR.MINOR.PATCH` based on changes. Use command `npm run publish:develop X.Y.Z` to start new version on `hermannhahn/develop`.
2. **Commit and Push:** Commit and push tested changes to `hermannhahn/develop`.`
3. **Pull Request:** Create new pull request to merge `hermannhahn/develop` into `hermannhahn/main`.
   - This workflow waits for the successful completion of `E2E Tests` and mantaintainers approval.
4. **Merge to Release:** After the PR is merged into `hermannhahn/main`, merge `hermannhahn/main` into `hermannhahn/release`.
5. **Automated Trigger:** A push to `hermannhahn/release` automatically triggers the `Trigger Release` workflow.
   - This workflow waits for the successful completion of both `Gemini CLI CI` and `E2E Tests`.
   - Upon success, it dispatches a event to trigger the `Release` workflow.
   - **Outcome:** The `Release` workflow use `hermannhahn/release` branch to build the CLI and core packages, creates the GitHub Release, attaches the executable, and publishes both `@hahnd/geminid` and `@hahnd/gemini-cli-core` packages to npm.
6. **Scheduled Trigger:** The `nightly-release.yml` workflow is executed daily at midnight UTC. It can also be manually triggered via GitHub Actions.
   - This workflow waits for the successful completion of both `Gemini CLI CI` and `E2E Tests`.
   - Upon success, it dispatches a event to trigger the `Nightly Release` workflow.
   - **Outcome:** The `Nightly Release` workflow use `hermannhahn/main` branch to build the CLI and core packages, creates the GitHub Release and attaches the executable. This release isn't published to npm.

At the end, merge back into `username/develop` to continue development.

### Running

To start the Gemini CLI from the source code (after building), run the following command from the root directory:

```bash
npm start
```

If you'd like to run the source build outside of the gemini-cli folder you can utilize `npm link path/to/gemini-cli/packages/cli` (see: [docs](https://docs.npmjs.com/cli/v9/commands/npm-link)) or `alias gemini="node path/to/gemini-cli/packages/cli"` to run with `geminid`

### Running Tests

### Linting and Preflight Checks

To ensure code quality and formatting consistency, run the preflight check:

```bash
npm run preflight
```

This command will run ESLint, Prettier, all tests, and other checks as defined in the project's `package.json`.

### Coding Conventions

- Please adhere to the coding style, patterns, and conventions used throughout the existing codebase.
- Consult [GEMINI.md](https://github.com/hermannhahn/gemini-cli/blob/main/GEMINI.md) (typically found in the project root) for specific instructions related to AI-assisted development, including conventions for React, comments, and Git usage.
- **Imports:** Pay special attention to import paths. The project uses `eslint-rules/no-relative-cross-package-imports.js` to enforce restrictions on relative imports between packages.
- **`npm ci` / `package-lock.json` issues:** If `npm ci` fails, your `package-lock.json` might be out of sync. Run `npm install` locally to update it, commit the changes, push to GitHub, and then retry the release workflow.

### Project Structure

- `packages/`: Contains the individual sub-packages of the project.
  - `cli/`: The command-line interface.
  - `core/`: The core backend logic for the Gemini CLI.
- `docs/`: Contains all project documentation.
- `scripts/`: Utility scripts for building, testing, and development tasks.

For more detailed architecture, see `docs/architecture.md`.

## Debugging

### VS Code:

0.  Run the CLI to interactively debug in VS Code with `F5`
1.  Start the CLI in debug mode from the root directory:
    ```bash
    npm run debug
    ```
    This command runs `node --inspect-brk dist/geminid.js` within the `packages/cli` directory, pausing execution until a debugger attaches. You can then open `chrome://inspect` in your Chrome browser to connect to the debugger.
2.  In VS Code, use the "Attach" launch configuration (found in `.vscode/launch.json`).

Alternatively, you can use the "Launch Program" configuration in VS Code if you prefer to launch the currently open file directly, but 'F5' is generally recommended.

To hit a breakpoint inside the sandbox container run:

```bash
DEBUG=1 geminid
```

### React DevTools

To debug the CLI's React-based UI, you can use React DevTools. Ink, the library used for the CLI's interface, is compatible with React DevTools version 4.x.

1.  **Start the Gemini CLI in development mode:**

    ```bash
    DEV=true npm start
    ```

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
