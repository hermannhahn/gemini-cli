# Gemini Dev CLI

This document provides essential context and instructions for the team assisting in the development of the **Gemini Dev CLI**. This project is a personal fork of the official Gemini CLI. This project was created by Hermann Hahn and is focused on custom modifications and improvements while maintaining compatibility for upstream updates.

## Git Repository

- **Branching Strategy:**
  - **NEVER modify directly.** `main`: Upstream base (mirror of official `google-gemini/gemini-cli`).
  - **NEVER modify directly.** `username/main`: Release branch for personal development. Only stable features are merged here from `username/develop`.
  - `username/develop`: Development branch for receive feat/hotfix merges, run tests and fix preflight errors before merge and release new version into `username/main`.
  - `username/feat/feature-name` or `username/hotfix/hotfix-name`: Feature/fix development branches, starded from `username/develop` and merged into `username/develop` upon completion.

- **Commit Messages:**
  - For multi-line commit messages, use multiple `-m` flags in the `git commit` command. Each `-m` flag represents a new line in the commit message.
  - Example: `git commit -m 'Subject line' -m 'Body line 1' -m 'Body line 2'`

## Documentation

- **Keep Updated:**
  - `TODO.md`: Project tasks. (Keep Updated)
  - `CHANGELOG.md`: Project updates. (Keep Updated)
  - `docs/`: Project documentation, especially feature-specific documentation (e.g., `docs/features/narrator.md`). (Keep Updated)

## Development Instructions

- **Workflow:** [WORKFLOW.md](./WORKFLOW.md)
- **Feature Development Status:** The IDE companion and Narrator features have been successfully implemented and tested.
- **Development Environment:** Developers uses `npm start` for development. Code changes require recompilation, fix errors, commit, push, and CLI restart for testing.
- **ToolResult Handling:**
  - `llmContent`: Always sent to the AI model for processing. Never suppressed.
  - `returnDisplay`: Used for terminal display.
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

### Standard Releases

When a feature/fix is merged into `hermannhahn/main` and a new release is desired:

1. **Decide New Version:** Determine `MAJOR.MINOR.PATCH` based on changes.
2. **Update Version Manually:** Update the `version` field in `package.json`, `packages/cli/package.json`, and `packages/core/package.json` to the new version.
3. **Commit and Push:** Commit the version update and push to `hermannhahn/main`.
4. **Automated Trigger:** A push to `hermannhahn/main` automatically triggers the `Trigger Release` workflow.
   - This workflow waits for the successful completion of both `Gemini CLI CI` and `E2E Tests`.
   - Upon success, it dispatches a `run-release` event to trigger the `Release` workflow.
   - **Outcome:** The `Release` workflow builds the CLI and core packages, creates the GitHub Release, attaches the executable, and publishes both `@hahnd/geminid` and `@hahnd/gemini-cli-core` packages to npm.

At the end, merge back into `username/develop` to continue development.

### Nightly Releases

To ensure continuous verification and provide early access to the latest changes, `nightly` releases are automatically generated daily.

- **Gatilho:** O workflow `nightly-release.yml` é executado diariamente à meia-noite UTC. Também pode ser disparado manualmente via GitHub Actions.
- **Branch de Origem:** O workflow faz o checkout da branch `main`.
- **Verificações:** Antes do lançamento, o workflow executa `npm run preflight` para garantir que o código esteja formatado, sem erros de lint, com tipos corretos e que todos os testes unitários e de integração passem.
- **Geração da Versão:** A versão `nightly` é gerada automaticamente usando o script `scripts/get-release-version.js` (função `getNightlyTagName()`), resultando em um formato como `vX.Y.Z-nightly.YYYYMMDD.sha`.
- **Publicação NPM:** Os pacotes `@hahnd/gemini-cli-core` e `@hahnd/geminid` são publicados no npm com a tag `nightly`.
- **Release GitHub:** Um novo release e tag são criados no GitHub com o nome da versão `nightly`, facilitando o acompanhamento das compilações diárias.
- **Requisitos de Segredos:** Para que este workflow funcione, os seguintes segredos devem estar configurados no repositório GitHub: `GEMINI_API_KEY`, `NPM_TOKEN` e `GITHUB_TOKEN`.

## Development Setup and Workflow

This section guides contributors on how to build, modify, and understand the development setup of this project.

### Running

To start the Gemini CLI from the source code (after building), run the following command from the root directory:

```bash
npm start
```

If you'd like to run the source build outside of the gemini-cli folder you can utilize `npm link path/to/gemini-cli/packages/cli` (see: [docs](https://docs.npmjs.com/cli/v9/commands/npm-link)) or `alias gemini="node path/to/gemini-cli/packages/cli"` to run with `gemini`

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
DEBUG=1 gemini
```

### React DevTools

To debug the CLI's React-based UI, you can use React DevTools. Ink, the library used for the CLI's interface, is compatible with React DevTools version 4.x.

1.  **Start the Gemini CLI in development mode:**

    ```bash
    DEV=true npm start
    ```

## Manual Publish

We publish an artifact for each commit to our internal registry. But if you need to manually cut a local build, then run the following commands:

```bash
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspace @hahnd/geminid
npm publish --workspace @hahnd/gemini-cli-core
```

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
