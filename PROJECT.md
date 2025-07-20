# Hermann Hahn's Personal Gemini CLI Project Overview

This project is based on a fork of the official Gemini CLI repository, with the primary goal of modifying, implementing, and improving the CLI experience for personal use. The project is structured to allow for easy integration of future updates from the official repository while maintaining a clear workflow for development and testing.

## Branches

- **main**: Upstream of the official Gemini CLI repository.
- **hermannhahn/main**: Hermann Hahn's personal branch, containing the modifications and improvements developed by him. This branch is the main functional branch for testing and running the CLI.
- **hermannhahn/tool/memory-tool**: Development branch for the memory tool improvement, which stores instructions for the Gemini agent.
- **hermannhahn/feat/short-term-memory**: Development branch for the Short-Term Memory (STM) feature, which will provide tools to manage structured memories in a JSON file.

## Additional Context

This document describes the branch workflow adopted for Hermann Hahn's personal project, a fork of `@google/gemini-cli`. The objective is to allow modifications, increments, and fixes for personal use, while maintaining the ability to integrate future updates from the official repository.

**Important Notes for the Gemini Assistant:**

- Hermann uses the compiled version of the CLI in development (`npm start`) to interact. Any code changes require recompilation, error correction, commit, and CLI restart for changes to be applied and tested.
- The Gemini Assistant has full access to the CLI code and can make direct changes to improve the user experience.

**Documentação da Feature STM:**
- Para detalhes sobre a feature Short-Term Memory (STM), consulte [docs/stm.md](./docs/stm.md).

**Lista de Tarefas (TODO):**
- Para acompanhar as tarefas pendentes do projeto, consulte [TODO.md](./TODO.md).

## Branching Strategy

1.  **`main` (from Hermann's fork): The Upstream Base**
    - **Purpose:** This branch should be an exact mirror of the `main` branch from the official repository (`https://github.com/google-gemini/gemini-cli.git`). It serves as the synchronization point for updates from the original project.
    - **Usage:** Never commit directly to this branch.
    - **Maintenance:** Regularly synchronize with `upstream/main`.

2.  **`hermannhahn/main`: Your Main Functional Branch**
    - **Purpose:** This is Hermann's primary working branch, containing all developed and tested functionalities. It is the "complete" and functional version of the personal project.
    - **Usage:** Base for creating new features and for running the CLI with personal modifications.
    - **Maintenance:** Integrate updates from `main` (from the fork) to stay current with the upstream.

3.  **`hermannhahn/feat/feature-name`: Feature Development Branches**
    - **Purpose:** Isolate the development of a specific feature, bug fix, or experiment.
    - **Usage:** Created from `hermannhahn/main`. All development and commits for a specific feature occur here.
    - **Maintenance:** After completion and testing of the feature, it is merged back into `hermannhahn/main` and the feature branch is deleted.

## Detailed Workflow

### 1. Initial Setup (once)

```bash
git remote add upstream https://github.com/google-gemini/gemini-cli.git # Adds the remote of the original project
git checkout main
git fetch upstream
git rebase upstream/main # Ensures your main is up to date
git checkout -b hermannhahn/main # Creates your main functional branch
git push -u origin hermannhahn/main # Publishes your functional branch to your fork
```

### 2. Regular Synchronization with Upstream

Execute this step regularly (e.g., weekly, or before starting a new development cycle) to ensure your project is up to date with the official one.

```bash
git checkout main
git fetch upstream
git rebase upstream/main # Updates your main with the latest from the official project
git checkout hermannhahn/main
git rebase main # Brings official updates to your functional branch
git push origin hermannhahn/main # Optional: to keep your remote fork updated
```

### 3. Developing a New Feature

```bash
git checkout hermannhahn/main # Make sure you are on your latest functional branch
git checkout -b hermannhahn/feat/feature-name # Creates the new feature branch
# ... Faça suas modificações e commits aqui ...
```

### 4. Finalizing and Integrating the Feature

```bash
git checkout hermannhahn/main
git merge hermannhahn/feat/feature-name --no-ff # Merges the feature with an explicit merge commit
git branch -d hermannhahn/feat/feature-name # Deletes the feature branch
git push origin hermannhahn/main # Updates your remote fork with the new feature
```

This workflow is an adaptation of the Feature Branch Workflow, optimized for personal development, ensuring organization, clarity, and the ability to integrate updates from the original project.
