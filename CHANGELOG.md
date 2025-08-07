# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-08-06

### Fixed [Unreleased]

- Reverted global installation fix to align with original project's publishing strategy, ensuring the root package is published with the bundled executable.
- Fixed release workflow by addressing "detached HEAD" issue during git push by creating a temporary branch.
- Fixed release workflow by ensuring `hermannhahn/release` branch is updated with `hermannhahn/main` before merging.
- Fixed release workflow by correcting the branch name variable in the 'Create Release, Tag and Publish' step.
- Fixed release workflow by correcting the branch name variable in the push command.
- Fixed linting error in `packages/core/src/core/client.ts` related to code formatting.
- Fixed nightly release workflow by ensuring the main branch is up-to-date before creating the GitHub Release.
- Resolved issue with `/narrator` command not working and re-integrated upstream React state/config updates.
- Fixed release and nightly release workflows to use the local `gemini-cli-core` package instead of the published npm version.

### Added [Unreleased]

- Added Narrator configuration and usage to README.md.
- Narrator feature documentation reviewed and finalized.

### Changed [Unreleased]

- Translated Portuguese content in README.md to English.
- Integrated latest upstream changes, resolved compilation and test failures.
- Narrator command flag changed from 'acts' to 'thinking'.
- Added upstream updates.

## [0.1.26] - 2025-08-02

### Added [0.1.26]

- Automated release workflow via GitHub Actions, triggered after successful CI and E2E tests.
- Custom run-names for release and trigger workflows, including package version.

### Changed [0.1.26]

- Renamed `@hahnd/gemini-cli-core` to `@hahnd/gemini-cli-core` and updated CLI dependency.
- Adjusted release workflow to publish both `@hahnd/geminid` and `@hahnd/gemini-cli-core`.

### Fixed [0.1.26]

- Resolved `EEXIST` error in `list_directory.test.js` by adding `recursive: true` to `mkdir` in `TestRig`.
- Fixed various linting issues in GitHub Actions workflow files (`release.yml`, `trigger-release.yml`).
- Corrected `repository_dispatch` parameters (`owner`, `repo`, `repository`) in `trigger-release.yml`.
- Removed debug `echo` step from `release.yml`.

## [0.1.0] - 2025-07-27

### Added [0.1.0]

- VS Code IDE Companion extension and documentation.

### Changed [0.1.0]

- Narrator feature documentation.

### Fixed [0.1.0]

- Resolved preflight errors and ensured all tests pass.

## [0.0.3] - 2025-07-25

### Added [0.0.3]

- Narrator feature documentation.

### Changed [0.0.3]

- Updated number formatting in UI components to use commas as decimal separators.
- Minor change to `scripts/update_package_versions.js` to suppress tag deletion error.

## [0.0.2] - 2025-07-23

### Added [0.0.2]

- Narrator feature documentation.
- Short-Term Memory (STM) functionality, including tools to add, search, and delete memories.
- Memory Tool functionality.

### Changed [0.0.2]

- Configured CLI package for npm publication as `@hahnd/geminid`.
- Updated branching strategy and refactored documentation.
