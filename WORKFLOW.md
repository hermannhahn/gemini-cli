## Detailed Workflow

This document outlines the development and release workflow for the **Gemini Dev CLI**, a personal fork of the official Gemini CLI. This workflow is optimized for personal development, ensuring organization, clarity, and the ability to integrate updates from the original project while enabling automated releases.

### Initial Setup (once)

```bash
git remote add upstream https://github.com/google-gemini/gemini-cli.git # Adds the remote of the original project
git checkout main
git fetch upstream
git rebase upstream/main # Ensures your main is up to date
git checkout -b hermannhahn/develop # Creates your development branch
git push -u origin hermannhahn/develop # Publishes your development branch to your fork
git checkout -b hermannhahn/main # Creates your main branch for releases
git push -u origin hermannhahn/main # Publishes your main branch to your fork
git checkout -b hermannhahn/release # Creates your release branch
git push -u origin hermannhahn/release # Publishes your release branch to your fork
```

### Regular Synchronization with Upstream

Execute this step regularly (e.g., weekly, or before starting a new development cycle) to ensure your project is up to date with the official one.

```bash
git checkout main
git fetch upstream
git rebase upstream/main # Updates your main with the latest from the official project
git checkout hermannhahn/develop
git rebase main # Brings official updates to your development branch
git push origin hermannhahn/develop # Optional: to keep your remote fork updated
```

### Developing a New Feature

```bash
git checkout hermannhahn/develop # Make sure you are on your latest development branch
git checkout -b hermannhahn/feat/feature-name # Creates the new feature branch
```

### Finalizing and Integrating the Feature

1.  **Merge to Development Branch:** After completing the feature, merge it into `hermannhahn/develop`.

    ```bash
    git checkout hermannhahn/develop
    git merge hermannhahn/feat/feature-name --no-ff # Merges the feature with an explicit merge commit
    git push origin hermannhahn/develop # Updates your remote fork with the new feature
    ```

2.  **Compile and Test:** Run preflight checks and tests.

    ```bash
    npm run preflight
    ```

3.  **Publish to Develop (Optional):** If you want to publish the changes from `hermannhahn/develop` to npm (e.g., for testing a specific version), use the `publish:develop` script.

    ```bash
    npm run publish:develop <version> # Example: npm run publish:develop 0.1.27
    ```

### Release Process

After changes are merged into `hermannhahn/develop` and are ready for a stable release:

1.  **Merge to Main:** Open a Pull Request (PR) from `hermannhahn/develop` to `hermannhahn/main`.
    *   Ensure all tests pass in the PR.
    *   Merge the PR into `hermannhahn/main`.

2.  **Trigger Release Workflow:** After a successful merge into `hermannhahn/main`, trigger the release process by merging `hermannhahn/main` into `hermannhahn/release`.

    ```bash
    npm run publish:release
    ```

    This script will:
    *   Merge `hermannhahn/main` into `hermannhahn/release`.
    *   Push the changes to `hermannhahn/release`.
    *   This push will trigger the `Release` workflow (`release.yml`) in GitHub Actions.

**Outcome:** The `Release` workflow will:

-   Build the CLI.
-   Run tests.
-   Publish the `@hahnd/gemini-cli-core` and `@hahnd/geminid` packages to npm.
-   Create the GitHub Release associated with the new tag, targeting the `hermannhahn/release` branch.

### Nightly Releases

The `Nightly Release` workflow (`nightly-release.yml`) is automatically triggered daily (or can be manually dispatched).

**Outcome:** The `Nightly Release` workflow will:

-   Checkout the `hermannhahn/main` branch.
-   Build the project.
-   Run tests.
-   Create a GitHub Release with a nightly tag, targeting the `hermannhahn/main` branch.

### Troubleshooting Release Issues:

-   **"tag already exists" error:** This means the Git tag already exists on GitHub. Delete it remotely before retrying:

    ```bash
    git push --delete origin <tag_name>
    ```

-   **`npm ci` / `package-lock.json` issues:** If `npm ci` fails, your `package-lock.json` might be out of sync. Run `npm install` locally to update it, commit the changes, push to GitHub, and then retry the release workflow.