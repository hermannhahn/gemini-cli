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
git checkout -b username/main # Creates your release branch
git push -u origin username/main # Publishes your release branch to your fork
```

### Regular Synchronization with Upstream

Execute this step regularly (e.g., weekly, or before starting a new development cycle) to ensure your project is up to date with the official one.

```bash
git checkout main
git fetch upstream
git rebase upstream/main # Updates your main with the latest from the official project
git checkout username/develop
git rebase main # Brings official updates to your development branch
git push origin username/develop # Optional: to keep your remote fork updated
```

### Developing a New Feature

```bash
git checkout username/develop # Make sure you are on your latest development branch
git checkout -b username/feat/feature-name # Creates the new feature branch
```

### Finalizing and Integrating the Feature

```bash
git checkout username/develop
git merge username/feat/feature-name --no-ff # Merges the feature with an explicit merge commit
git push origin username/develop # Updates your remote fork with the new feature
```

### Release Process

After a feature or fix is merged into `username/develop` and a new release is desired, follow these steps:

1. **Run preflight** Run preflight and fix errors if necessary.

```bash
npm run preflight
```

2.  **Merge to Release Branch:** Merge `username/develop` into `username/main`.

```bash
git checkout username/main
git merge username/develop --no-ff # Merges the development branch into the release branch
git push origin username/main # Updates your remote release branch
```

3.  **Update Version & Tag:**
    *   Run the automated script to update versions and create the tag:
        ```bash
        npm run release:update-versions -- <new_version>
        ```
    *   If a tag for the desired version already exists locally, delete it first: `git tag -d <tag_name>`.

4.  **Push Tag:** Push the newly created tag to your remote GitHub repository.

```bash
git push origin username/main --tags
```

6.  **Trigger Release Workflow:** The `Release` workflow in GitHub Actions is automatically triggered upon pushing to `username/main`.

**Outcome:** The workflow will:

- Build the CLI.
- Create the GitHub Release associated with the tag.
- Attach the compiled executable (`bundle/geminid.js`) to the release.
- Publish the package to npm.

7. Go back to `username/develop` branch.

8. **Synchronize Development Branch Version:** After a successful release, update the `package.json` version in `username/develop` to match the newly released version.

```bash
git checkout username/develop
npm version <released_version> --no-git-tag-version
git add package.json && git commit -m "chore: Update package.json to released version"
git push origin username/develop
```

**Troubleshooting Release Issues:**

- **"tag already exists" error:** This means the Git tag already exists on GitHub. Delete it remotely before retrying:

```bash
git push --delete origin <tag_name>
```

- **`npm ci` / `package-lock.json` issues:** If `npm ci` fails, your `package-lock.json` might be out of sync. Run `npm install` locally to update it, commit the changes, push to GitHub, and then retry the release workflow.
