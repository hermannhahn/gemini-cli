# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial setup of the `hermannhahn/main` branch, mirroring the upstream `main`.

### Changed

- Refactored `PROJECT.md` to be entirely in English for better clarity and consistency.
- Refactored `CHANGELOG.md` to follow a professional, standardized format (Keep a Changelog).

### Fixed

- Adjusted numeric formatting in `packages/cli/src/ui/components/StatsDisplay.test.tsx` to resolve snapshot failures caused by locale-specific number formatting (comma vs. dot as thousands separator).

### Removed

- N/A

## [0.0.1] - 2025-07-20

### Added

- Initial commit of the forked Gemini CLI project.

### Changed

- **Terminology Refactoring:** Replaced "fact" with "instruction" across the codebase and documentation to align with the memory tool's purpose of storing instructions for the agent.
  - **Affected Files:**
    - `docs/tools/memory.md`
    - `packages/core/src/tools/memoryTool.ts`
    - `packages/core/src/tools/memoryTool.test.ts`
    - `packages/core/src/core/prompts.ts`
    - `packages/cli/src/ui/hooks/useGeminiStream.test.tsx`
    - `packages/cli/src/ui/commands/memoryCommand.ts`
    - `packages/cli/src/ui/commands/memoryCommand.test.ts`
- **Tool Name Refactoring:** Renamed `save_memory` to `save_instruction` throughout the code, including variable names, function names, and comments, to maintain consistency with the new "instruction" terminology.

### Fixed

- N/A

### Removed

- N/A