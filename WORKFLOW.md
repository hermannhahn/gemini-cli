## Detailed Workflow

This document outlines the development and release workflow for the **Gemini Dev CLI**, a personal fork of the official Gemini CLI. This workflow is optimized for personal development, ensuring organization, clarity, and the ability to integrate updates from the original project while enabling automated releases.

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
```

### 4. Finalizing and Integrating the Feature

```bash
git checkout hermannhahn/main
git merge hermannhahn/feat/feature-name --no-ff # Merges the feature with an explicit merge commit
git push origin hermannhahn/main # Updates your remote fork with the new feature
```

### 5. Release Process

After a feature or fix is merged into `hermannhahn/main` and a new release is desired, follow these steps:

1.  **Decide New Version:** Determine the new version number following Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`). For new packages on npm, start with `0.0.1`.

2.  **Update Version & Tag:** On the `hermannhahn/main` branch, run `npm version <major|minor|patch>`. This command:
    - Updates the `version` field in `package.json` (root) and `packages/cli/package.json`.
    - Creates a new Git commit with the version update.
    - Creates a new Git tag (e.g., `v0.0.1`).

    ```bash
    npm version patch # Example for a patch release
    ```

3.  **Push Tag:** Push the newly created tag to your remote GitHub repository.

    ```bash
    git push origin hermannhahn/main --tags
    ```

4.  **Trigger Release Workflow:** Manually trigger the `Release` workflow in GitHub Actions. This can be done via the GitHub web interface or using the `gh` CLI.
    - **Via GitHub Web Interface:**
      1.  Go to your repository on GitHub.
      2.  Navigate to the "Actions" tab.
      3.  Select the "Release" workflow from the left sidebar.
      4.  Click "Run workflow" (or "Run workflow from branch").
      5.  For "Use workflow from", select `hermannhahn/main`.
      6.  For "version", enter the new version (e.g., `v0.0.1`).
      7.  For "ref", enter `hermannhahn/main`.
      8.  Click "Run workflow".

    - **Via `gh` CLI:**

      ```bash
      gh workflow run release.yml --ref hermannhahn/main -F version=v0.0.1 -F ref=hermannhahn/main
      ```

    **Outcome:** The workflow will:
    - Build the CLI.
    - Create the GitHub Release associated with the tag.
    - Attach the compiled executable (`bundle/gemini.js`) to the release.
    - Publish the `@hahnd/gemini-dev` package to npm.

**Troubleshooting Release Issues:**

- **"tag already exists" error:** This means the Git tag already exists on GitHub. Delete it remotely before retrying:

  ```bash
  git push --delete origin <tag_name>
  ```

- **"cannot publish over existing <version>" (npm) error:** This means the specific package version is already published on npm. You cannot overwrite published versions. Increment the version number (e.g., from `0.0.1` to `0.0.2`) and retry the release process from step 2.

- **`npm ci` / `package-lock.json` issues:** If `npm ci` fails, your `package-lock.json` might be out of sync. Run `npm install` locally to update it, commit the changes, push to GitHub, and then retry the release workflow.
