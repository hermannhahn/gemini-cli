# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Resolved `stm.test.ts` failures by correcting date comparison logic and removing unused variables.

### Changed

- Refactoring date handling in STM tools to use `YYYY-MM-DD` format for storage and search.
- Updated the description of the `MemoryTool` in the system prompt.

### Added

- Initial setup of the development branch `hermannhahn/main`, mirroring the upstream `main`.
- Added `CHANGELOG.md` to track project changes and updates.
- Added `WORKFLOW.md` to document the development workflow.
- Introduced `TODO.md` to outline current tasks and features in development.

### Added

- Initial setup of the development branch `hermannhahn/main`, mirroring the upstream `main`.
- Added `CHANGELOG.md` to track project changes and updates.
- Added `WORKFLOW.md` to document the development workflow.
- Introduced `TODO.md` to outline current tasks and features in development.

### Changed

### Fixed

### Removed

## [0.0.1] - 2025-07-20

### Added

- Initial setup of the `hermannhahn/tool/memory-tool` branch from the `hermannhahn/main` branch.

### Changed

- Refactored the `MemoryTool`.

## [0.0.2] - 2025-07-21

### Added

- Merged the `hermannhahn/tool/memory-tool` branch into the `hermannhahn/main` branch.

## [0.0.3] - 2025-07-21

### Added

- Initial setup of the `hermannhahn/feat/short-term-memory` branch from the `hermannhahn/main` branch.
- Introduced the `Short-Term Memory (STM)` feature with the following tasks:
  - Defined the exact location of the `stm.json` file.
  - Implemented functions for reading, writing, and manipulating the JSON file.
  - Integrated `add_stm` and `search_stm` tools into the model's `ToolRegistry`.
  - Added unit and integration tests for all tools.
