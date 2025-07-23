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
```

### 4. Finalizing and Integrating the Feature

```bash
git checkout hermannhahn/main
git merge hermannhahn/feat/feature-name --no-ff # Merges the feature with an explicit merge commit
git push origin hermannhahn/main # Updates your remote fork with the new feature
```

This workflow is an adaptation of the Feature Branch Workflow, optimized for personal development, ensuring organization, clarity, and the ability to integrate updates from the original project.
