# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.2] - 2025-07-23

### Added

- Completed and merged Short-Term Memory (STM) functionality, including tools to add, search, and delete memories.

### Changed

- Adjustments and refactorings in memory and STM tools, and `MemoryTool` description update.
- Adjusted status suppression for STM tools.
- Configured CLI package for npm publication as `@hahnd/gemini-dev`.

### Fixed

- Corrections in STM-related tests, including suppressing `search_stm` tool output to ensure `llmContent` is always returned to the model.
- Refactored `GEMINI.md` for conciseness and alignment with "Dev CLI" name.
- Various corrections in the GitHub Actions release workflow to enable publishing and release creation.

## [0.0.3] - 2025-07-21

### Added

- Initial setup of the `hermannhahn/feat/short-term-memory` branch from the `hermannhahn/main` branch.
- Introduced Short-Term Memory (STM) functionality.

## [0.0.2] - 2025-07-21

### Added

- Merged the `hermannhahn/tool/memory-tool` branch into the `hermannhahn/main` branch.

## [0.0.1] - 2025-07-20

### Added

- Initial setup of the `hermannhahn/tool/memory-tool` branch from the `hermannhahn/main` branch.

### Changed

- Refactored the `MemoryTool`.
