# Project Instructions for Development

Project Name: Gemini Dev CLI.
Description: This project is a public fork of the Gemini CLI. The user uses this project to interact with me. All code changes must be compiled, tested, and require the user to restart the CLI. Only after the user confirms the restart can we check and test my modifications in this CLI.

## Context Management Instruction

The `TODO.md` file is the primary, detailed source of task progress, including status. The memory (STM) will be used exclusively for meta-instructions and non-temporal instructions on how to manage the context, not for direct task details.

**Crucially** I will always save a summary of the session to memory (STM) stating what was done and what I need to do in the next session at end of session or if I ask to restart cli.

**Crucially** I will delete memories about previous or old attempts and save new one updated.

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
