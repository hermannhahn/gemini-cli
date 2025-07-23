# Dev CLI Project Context for Gemini Agent

This document provides essential context and instructions for the Gemini AI assisting in the development of the **Dev CLI**. This project is a personal fork of the official Gemini CLI, focused on custom modifications and improvements for personal use, while maintaining compatibility for upstream updates.

## Project Structure & Workflow

- **Purpose:** Develop and maintain the Dev CLI, a personal command-line interface.
- **Branching Strategy:**
    - `main`: Upstream base (mirror of official `google-gemini/gemini-cli`). Do not commit directly.
    - `hermannhahn/main`: Main functional branch for personal development. Features are merged here.
    - `hermannhahn/feat/feature-name`: Feature/fix development branches, merged into `hermannhahn/main` upon completion.
- **Key Files:**
    - `TODO.md`: Project tasks.
    - `CHANGELOG.md`: Project updates.
    - `WORKFLOW.md`: Development workflow details.
    - `docs/`: Project documentation.

## Implemented Features

- **Long-Term Memory (LTM):** Tool for permanent instructions/information storage.
- **Short-Term Memory (STM):** Manages structured memories in a JSON file for session context.

## Instructions for Gemini Agent

- **Development Environment:** Hermann uses `npm start` for development. Code changes require recompilation, error correction, commit, and CLI restart for testing.
- **ToolResult Handling:**
    - `llmContent`: Always sent to the AI model for processing. Never suppressed.
    - `returnDisplay`: Used for terminal display. Can be suppressed by `STM_SHOW_STATUS` environment variable for cleaner UI, without affecting model reasoning.
- **Code Quality & Standards:**
    - **Build & Test:** Always run `npm run preflight` to validate changes (build, test, typecheck, lint, fix errors).
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
- **Comments Policy:** Only high-value comments, explaining *why*. Avoid conversational comments.
- **General Style:** Use hyphens for flag names (e.g., `my-flag`).

## Git Repository

- The main branch for this project is `main`.

## Release Process (Automated via GitHub Actions)

When a feature/fix is merged into `hermannhahn/main` and a new release is desired:
1. **Decide New Version:** Determine `MAJOR.MINOR.PATCH` based on changes.
2. **Update Version & Tag:** Run `npm version <major|minor|patch>` on `hermannhahn/main`. This updates `package.json`, creates a version commit, and a Git tag.
3. **Push Tag:** Execute `git push origin hermannhahn/main --tags` to push the new tag to GitHub.
4. **Trigger Workflow:** Manually trigger the `Release` workflow in GitHub Actions (via UI or `gh workflow run`).
    - **Inputs:** `version` (e.g., `v0.0.1`), `ref` (`hermannhahn/main`).
    - **Outcome:** The workflow builds the CLI, creates the GitHub Release, attaches the executable, and publishes the `@hahnd/dev-cli` package to npm.
