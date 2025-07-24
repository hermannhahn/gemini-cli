# Gemini Dev CLI

This document provides essential context and instructions for the team assisting in the development of the **Gemini Dev CLI**. This project is a personal fork of the official Gemini CLI. This project was created by Hermann Hahn and is focused on custom modifications and improvements while maintaining compatibility for upstream updates.

## Git Repository

- **Branching Strategy:**
  - **NEVER modify directly.** `main`: Upstream base (mirror of official `google-gemini/gemini-cli`).
  - **NEVER modify directly.** `username/main`: Release branch for personal development. Only stable features are merged here from `username/develop`.
  - `username/develop`: Development branch for receive feat/hotfix merges, run tests and fix preflight errors before merge and release new version into `username/main`.
  - `username/feat/feature-name` or `username/hotfix/hotfix-name`: Feature/fix development branches, starded from `username/develop` and merged into `username/develop` upon completion.

## Documentation

- **Keep Updated:**
  - `TODO.md`: Project tasks. (Keep Updated)
  - `CHANGELOG.md`: Project updates. (Keep Updated)
  - `docs/`: Project documentation. (Keep Updated)

## Development Instructions

- **Workflow:** [WORKFLOW.md](./WORKFLOW.md)
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

When a feature/fix is merged into `username/main` and a new release is desired:

1. **Decide New Version:** Determine `MAJOR.MINOR.PATCH` based on changes.
2. **Update Version & Tag:** Run `npm version <major|minor|patch>` on `username/main`. This updates `package.json`, creates a version commit, and a Git tag.
3. **Push Tag:** Execute `git push origin username/main --tags` to push the new tag to GitHub.
4. **Trigger Workflow:** Manually trigger the `Release` workflow in GitHub Actions (via UI or `gh workflow run`).
   - **Inputs:** `version` (e.g., `v0.0.1`), `ref` (`username/main`).
   - **Outcome:** The workflow builds the CLI, creates the GitHub Release, attaches the executable, and publishes the `@hahnd/geminid` package to npm.

At the end, merge back into `username/develop` to continue development.

## Development Setup and Workflow

This section guides contributors on how to build, modify, and understand the development setup of this project.

### Setting Up the Development Environment

**Prerequisites:**

1.  **Node.js**:
    - **Development:** Please use Node.js `~20.19.0`. This specific version is required due to an upstream development dependency issue. You can use a tool like [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.
    - **Production:** For running the CLI in a production environment, any version of Node.js `>=20` is acceptable.
2.  **Git**

### Enabling Sandboxing

[Sandboxing](#sandboxing) is highly recommended and requires, at a minimum, setting `GEMINI_SANDBOX=true` in your `~/.env` and ensuring a sandboxing provider (e.g. `macOS Seatbelt`, `docker`, or `podman`) is available. See [Sandboxing](#sandboxing) for details.

To build both the `gemini` CLI utility and the sandbox container, run `build:all` from the root directory:

```bash
npm run build:all
```

To skip building the sandbox container, you can use `npm run build` instead.

### Running

To start the Gemini CLI from the source code (after building), run the following command from the root directory:

```bash
npm start
```

If you'd like to run the source build outside of the gemini-cli folder you can utilize `npm link path/to/gemini-cli/packages/cli` (see: [docs](https://docs.npmjs.com/cli/v9/commands/npm-link)) or `alias gemini="node path/to/gemini-cli/packages/cli"` to run with `gemini`

### Running Tests

This project contains two types of tests: unit tests and integration tests.

#### Unit Tests

To execute the unit test suite for the project:

```bash
npm run test
```

This will run tests located in the `packages/core` and `packages/cli` directories. Ensure tests pass before submitting any changes. For a more comprehensive check, it is recommended to run `npm run preflight`.

#### Integration Tests

The integration tests are designed to validate the end-to-end functionality of the Gemini CLI. They are not run as part of the default `npm run test` command.

To run the integration tests, use the following command:

```bash
npm run test:e2e
```

For more detailed information on the integration testing framework, please see the [Integration Tests documentation](./docs/integration-tests.md).

### Linting and Preflight Checks

To ensure code quality and formatting consistency, run the preflight check:

```bash
npm run preflight
```

This command will run ESLint, Prettier, all tests, and other checks as defined in the project's `package.json`.

_ProTip_

after cloning create a git precommit hook file to ensure your commits are always clean.

```bash
echo "
# Run npm build and check for errors
if ! npm run preflight; then
  echo "npm build failed. Commit aborted."
  exit 1
fi
" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

#### Formatting

To separately format the code in this project by running the following command from the root directory:

```bash
npm run format
```

This command uses Prettier to format the code according to the project's style guidelines.

#### Linting

To separately lint the code in this project, run the following command from the root directory:

```bash
npm run lint
```

### Coding Conventions

- Please adhere to the coding style, patterns, and conventions used throughout the existing codebase.
- Consult [GEMINI.md](https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md) (typically found in the project root) for specific instructions related to AI-assisted development, including conventions for React, comments, and Git usage.
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
    This command runs `node --inspect-brk dist/gemini.js` within the `packages/cli` directory, pausing execution until a debugger attaches. You can then open `chrome://inspect` in your Chrome browser to connect to the debugger.
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

2.  **Install and run React DevTools version 4.28.5 (or the latest compatible 4.x version):**

    You can either install it globally:

    ```bash
    npm install -g react-devtools@4.28.5
    react-devtools
    ```

    Or run it directly using npx:

    ```bash
    npx react-devtools@4.28.5
    ```

    Your running CLI application should then connect to React DevTools.
    ![](/docs/assets/connected_devtools.png)

## Sandboxing

### MacOS Seatbelt

On MacOS, `gemini` uses Seatbelt (`sandbox-exec`) under a `permissive-open` profile (see `packages/cli/src/utils/sandbox-macos-permissive-open.sb`) that restricts writes to the project folder but otherwise allows all other operations and outbound network traffic ("open") by default. You can switch to a `restrictive-closed` profile (see `packages/cli/src/utils/sandbox-macos-restrictive-closed.sb`) that declines all operations and outbound network traffic ("closed") by default by setting `SEATBELT_PROFILE=restrictive-closed` in your environment or `.env` file. Available built-in profiles are `{permissive,restrictive}-{open,closed,proxied}` (see below for proxied networking). You can also switch to a custom profile `SEATBELT_PROFILE=<profile>` if you also create a file `.gemini/sandbox-macos-<profile>.sb` under your project settings directory `.gemini`.

### Container-based Sandboxing (All Platforms)

For stronger container-based sandboxing on MacOS or other platforms, you can set `GEMINI_SANDBOX=true|docker|podman|<command>` in your environment or `.env` file. The specified command (or if `true` then either `docker` or `podman`) must be installed on the host machine. Once enabled, `npm run build:all` will build a minimal container ("sandbox") image and `npm start` will launch inside a fresh instance of that container. The first build can take 20-30s (mostly due to downloading of the base image) but after that both build and start overhead should be minimal. Default builds (`npm run build`) will not rebuild the sandbox.

Container-based sandboxing mounts the project directory (and system temp directory) with read-write access and is started/stopped/removed automatically as you start/stop Gemini CLI. Files created within the sandbox should be automatically mapped to your user/group on host machine. You can easily specify additional mounts, ports, or environment variables by setting `SANDBOX_{MOUNTS,PORTS,ENV}` as needed. You can also fully customize the sandbox for your projects by creating the files `.gemini/sandbox.Dockerfile` and/or `.gemini/sandbox.bashrc` under your project settings directory (`.gemini`) and running `gemini` with `BUILD_SANDBOX=1` to trigger building of your custom sandbox.

#### Proxied Networking

All sandboxing methods, including MacOS Seatbelt using `*-proxied` profiles, support restricting outbound network traffic through a custom proxy server that can be specified as `GEMINI_SANDBOX_PROXY_COMMAND=<command>`, where `<command>` must start a proxy server that listens on `:::8877` for relevant requests. See `docs/examples/proxy-script.md` for a minimal proxy that only allows `HTTPS` connections to `example.com:443` (e.g. `curl https://example.com`) and declines all other requests. The proxy is started and stopped automatically alongside the sandbox.

## Manual Publish

We publish an artifact for each commit to our internal registry. But if you need to manually cut a local build, then run the following commands:

```bash
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```
