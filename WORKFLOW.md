## Detailed Workflow

This document outlines the development and release workflow for the **Gemini Dev CLI**, a personal fork of the official Gemini CLI. This workflow is optimized for personal development, ensuring organization, clarity, and the ability to integrate updates from the original project while enabling automated releases.

### Initial Setup (once)

```bash
git remote add upstream https://github.com/google-gemini/gemini-cli.git # Adds the remote of the original project
git checkout main
git fetch upstream
git rebase upstream/main # Ensures your main is up to date
git checkout -b username/develop # Creates your development branch
git push -u origin username/develop # Publishes your development branch to your fork
git checkout -b username/main # Creates your main branch for releases
git push -u origin username/main # Publishes your main branch to your fork
git checkout -b username/release # Creates your release branch
git push -u origin username/release # Publishes your release branch to your fork
```

### Regular Synchronization with Upstream

Execute this step regularly (e.g., weekly, or before starting a new development cycle) to ensure your project is up to date with the official one.

```bash
git checkout main
git fetch upstream
git rebase upstream/main # Updates your main with the latest from the official project
git checkout username/develop
git checkout -b username/rebase
git rebase main # Brings official updates to rebase branch
git checkout username/develop
git push -u origin username/develop  # Update development branch
git merge username/rebase # Merges the rebase branch into develop
git branch -d username/rebase # Deletes the temporary rebase branch
```

### Developing a New Feature

```bash
git checkout username/develop # Make sure you are on your latest development branch
git checkout -b username/feat/feature-name # Creates the new feature branch
git checkout -b username/hotfix/hotfix-name # Creates the new hotfix branch
```

### Finalizing and Integrating the Feature

1.  **Merge to Development Branch:** After completing the feature, merge it into `username/develop`.

    ```bash
    git checkout username/develop
    git merge username/feat/feature-name --no-ff # Merges the feature with an explicit merge commit
    git push origin username/develop # Updates your remote fork with the new feature
    ```

2.  **Compile and Test:** Run preflight checks and tests.

    ```bash
    npm run preflight
    ```

3.  **Publish to Develop:** Publish the changes from `username/develop` to GitHub (e.g., for save tested feat or fix), use the `publish:develop` script to start new version on `username/develop` or only commit and push the changes for the same version.

    ```bash
    npm run publish:develop <version> # Example: npm run publish:develop 0.1.27
    ```

### Release Process

After changes are merged into `username/develop` and are ready for a stable release:

1.  **Merge to Main:** Open a Pull Request (PR) from `username/develop` to `username/main`.
    - Ensure all tests pass in the PR.
    - Merge the PR into `username/main`.

2.  **Trigger Release Workflow:** After a successful merge into `username/main`, trigger the release process by merging `username/main` into `username/release`.

    ```bash
    npm run publish:release
    ```

    This script will:
    - Merge `username/main` into `username/release`.
    - Push the changes to `username/release`.
    - This push will trigger the `Release` workflow (`release.yml`) in GitHub Actions.

**Outcome:** The `Release` workflow will:

- Build the CLI.
- Run tests.
- Publish the `@hahnd/gemini-cli-core` and `@hahnd/geminid` packages to npm.
- Create the GitHub Release associated with the new tag, targeting the `username/release` branch.

### Nightly Releases

The `Nightly Release` workflow (`nightly-release.yml`) is automatically triggered daily (or can be manually dispatched).

**Outcome:** The `Nightly Release` workflow will:

- Checkout the `username/main` branch.
- Build the project.
- Run tests.
- Create a GitHub Release with a nightly tag, targeting the `username/main` branch.

### Troubleshooting Release Issues:

- **"tag already exists" error:** This means the Git tag already exists on GitHub. Delete it remotely before retrying:

  ```bash
  git push --delete origin <tag_name>
  ```

- **npm version error** Upgrade to the next version.

- **`npm ci` / `package-lock.json` issues:** If `npm ci` fails, your `package-lock.json` might be out of sync. Run `npm install` locally to update it, commit the changes, push to GitHub, and then retry the release workflow.
