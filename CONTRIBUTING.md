# How to Contribute

We would love to accept your patches and contributions to this project.

## Before you begin

### Sign our Contributor License Agreement

Contributions to this project are welcome. Fork it and send us yours. Please read the entire developer documentation before submitting a contribution.

AI models are authorized to contribute to the development, maintenance, and improvements of this project.

### Review our Community Guidelines

This project follows [Google's Open Source Community
Guidelines](https://opensource.google/conduct/).

## Contribution Process

### Code Reviews

All submissions to release branch, including submissions by project members, require review. We
use [GitHub pull requests](https://docs.github.com/articles/about-pull-requests)
for this purpose.

### Pull Request Guidelines

To help us review and merge your PRs quickly, please follow these guidelines. PRs that do not meet these standards may be closed.

#### 1. Link to an Existing Issue

All PRs should be linked to an existing issue in our tracker. This ensures that every change has been discussed and is aligned with the project's goals before any code is written.

- **For bug fixes:** The PR should be linked to the bug report issue.
- **For features:** The PR should be linked to the feature request or proposal issue that has been approved by a maintainer.

If an issue for your change doesn't exist, please **open one first** and wait for feedback before you start coding.

#### 2. Keep It Small and Focused

We favor small, atomic PRs that address a single issue or add a single, self-contained feature.

- **Do:** Create a PR that fixes one specific bug or adds one specific feature.
- **Don't:** Bundle multiple unrelated changes (e.g., a bug fix, a new feature, and a refactor) into a single PR.

Large changes should be broken down into a series of smaller, logical PRs that can be reviewed and merged independently.

#### 3. Use Draft PRs for Work in Progress

If you'd like to get early feedback on your work, please use GitHub's **Draft Pull Request** feature. This signals to the maintainers that the PR is not yet ready for a formal review but is open for discussion and initial feedback.

#### 4. Ensure All Checks Pass

Before submitting your PR, ensure that all automated checks are passing by running `npm run preflight`. This command runs all tests, linting, and other style checks.

#### 5. Update Documentation

If your PR introduces a user-facing change (e.g., a new command, a modified flag, or a change in behavior), you must also update the relevant documentation in the `/docs` directory.

#### 6. Write Clear Commit Messages and a Good PR Description

Your PR should have a clear, descriptive title and a detailed description of the changes. Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for your commit messages.

- **Good PR Title:** `feat(cli): Add --json flag to 'config get' command`
- **Bad PR Title:** `Made some changes`

In the PR description, explain the "why" behind your changes and link to the relevant issue (e.g., `Fixes #123`).

## Forking

If you are forking the repository you will be able to run the Build, Test and Integration test workflows. However in order to make the integration tests run you'll need to add a [GitHub Repository Secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) with a value of `GEMINI_API_KEY` and set that to a valid API key that you have available. Your key and secret are private to your repo; no one without access can see your key and you cannot see any secrets related to this repo.

Additionally you will need to click on the `Actions` tab and enable workflows for your repository, you'll find it's the large blue button in the center of the screen.
