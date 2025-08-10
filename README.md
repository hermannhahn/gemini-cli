# 🧠 Geminid

The Gemini CLI for Developers

[![Gemini CLI CI](https://github.com/hermannhahn/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/hermannhahn/gemini-cli/actions/workflows/ci.yml) ![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

This repository contains the **Geminid**, a public fork of the [official Gemini CLI](https://github.com/google-gemini/gemini-cli). Our goal is to extend and customize the tool for specific development workflows, while maintaining compatibility for future updates from the original project.

Perfect for: Developers, researchers, content creators, and anyone who wants a well-configured Gemini CLI setup with powerful automation capabilities.

## 📑 Context Files

- Create `GEMINI.md` files or make a simple request to permanently save instructions in Gemini's context file.

## 🦾 Custom Features

✨ Geminid includes the following custom features:

- 🗣️ **Narrator** Provides audio feedback to the CLI, with modes for AI thinking, responses, or off (default).
- 🗃️ **Short-Term Memory (STM)** Request Gemini to remember things, then ask Gemini to recall them later.
- 📡 **Upstream Updates** Regularly synchronized with the official Gemini CLI to incorporate the latest features and improvements.

## 📌 Next Steps

✨ What I'm working on:

🎙️ Voice activated - Just say "hey gemini" to talk or send your request
📅 Natural Language Scheduling - Say "daily at 9am" to schedule recurring tasks
🏃 Background processing - Run long tasks in AFk mode while you do other work

## 🖥️ Quickstart

**Prerequisites** Ensure you have [Node.js version 20](https://nodejs.org/en/download) or higher installed.
**Run the CLI** Execute the following command in your terminal to install and use the Geminid:

    ```bash
    npm install -g @hahnd/geminid
    ```

    Then, run the CLI from anywhere:

    ```bash
    geminid
    ```

    Or just prompt for a request:

    ```bash
    geminid "What's the weather like in London?"
    ```

🔑 **Authenticate** When prompted, sign in with your personal Google account. This will grant you up to 60 model requests per minute and 1,000 model requests per day using Gemini.

You're ready to use the Geminid!

### 🗝️ Environment Variables

- `GEMINI_API_KEY="YOUR_API_KEY"`: Your Gemini API key. (optional)
- `MICROSOFT_TTS_KEY`: Your Microsoft Text-to-Speech API key. (optional)
- `MICROSOFT_TTS_REGION`: The Azure region for your TTS service (e.g., `eastus`). (optional)
- `MICROSOFT_TTS_VOICE`: The specific voice to use for responses (e.g., `en-US-JennyNeural`). (optional)
- `MICROSOFT_TTS_THINKING`: The specific voice to use for AI thinking narration (e.g., `en-US-JennyNeural`). (optional)

## 🛠️ Narrator Configuration and Usage

The Narrator feature provides audio feedback for the Gemini CLI. You can configure its behavior using environment variables and control it with CLI commands or flags.

1.  Generate a key in [Azure Text-to-Speech](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speech-key).
2.  Set it as an environment variable in your terminal. Replace `YOUR_API_KEY` and `MICROSOFT_TTS_REGION` with your generated key and API region.

    ```bash
    export MICROSOFT_TTS_KEY="YOUR_API_KEY"
    export MICROSOFT_TTS_REGION="eastus"
    export MICROSOFT_TTS_VOICE="en-US-JennyNeural"
    export MICROSOFT_TTS_THINKING="en-US-JennyNeural"
    ```

3.  (Optional) Add to your `.bashrc` or `.zshrc` for persistence:

    ```bash
    echo 'export MICROSOFT_TTS_KEY="YOUR_API_KEY"' >> ~/.bashrc
    echo 'export MICROSOFT_TTS_REGION="eastus"' >> ~/.bashrc
    echo 'export MICROSOFT_TTS_VOICE="en-US-JennyNeural"' >> ~/.bashrc
    echo 'export MICROSOFT_TTS_THINKING="en-US-JennyNeural"' >> ~/.bashrc
    source ~/.bashrc
    ```

### ⚙️ Narrator Modes

You can switch between Narrator modes using the `/narrator` command:

- 🔇 `/narrator off`: Disables audio narration.
- 💭 `/narrator thinking`: Narrates AI model actions (tool calls, thoughts) as they occur.
- 🗣️ `/narrator response`: Narrates a summary, observation, or important warning about the AI model's response.

### 🏳️ Initialization Flag

You can set the initial Narrator mode when starting the CLI using the `--narrator` flag:

- `geminid --narrator [off|thinking|response]`: Sets the initial narrator mode. For example, `geminid --narrator thinking` will start the CLI with AI thoughts narrated.

## 🔑 Use a Gemini API Key

The Gemini API offers a free tier with [100 requests per day](https://ai.google.dev/gemini-api/docs/rate-limits#free-tier) using Gemini 2.5 Pro, control over which model you use, and access to higher rate limits (with a paid plan):

1.  Generate a key in [Google AI Studio](https://aistudio.google.com/apikey).
2.  Set it as an environment variable in your terminal. Replace `YOUR_API_KEY` with your generated key.

    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

3.  (Optional) Add to your `.bashrc` or `.zshrc` for persistence:

    ```bash
    echo 'export GEMINI_API_KEY="YOUR_API_KEY"' >> ~/.bashrc
    source ~/.bashrc
    ```

4.  (Optional) Upgrade your Gemini API project to a paid plan on the API key page (will automatically unlock [Tier 1 rate limits](https://ai.google.dev/gemini-api/docs/rate-limits#tier-1))

### 🔑 Use a Vertex AI API Key

The Vertex AI API offers a [free tier](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview) using express mode for Gemini 2.5 Pro, control over which model you use, and access to higher rate limits with a billing account:

1.  Generate a key in [Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys).
2.  Set it as an environment variable in your terminal. Replace `YOUR_API_KEY` with your generated key and set GOOGLE_GENAI_USE_VERTEXAI to true

    ```bash
    export GOOGLE_API_KEY="YOUR_API_KEY"
    export GOOGLE_GENAI_USE_VERTEXAI=true
    ```

3.  (Optional) Add a billing account to your project for access to [higher usage limits](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas)

For other authentication methods, including Google Workspace accounts, refer to the [authentication guide](./docs/cli/authentication.md).

## 💻 CLI Usage and Examples

Once the CLI is running, you can start interacting with Gemini from your shell.

You can start a project from a new directory:

```sh
cd new-project/
geminid
> Write me a Gemini Discord bot that answers questions using a FAQ.md file I will provide
```

Or work with an existing project:

```sh
git clone https://github.com/hermannhahn/gemini-cli
cd gemini-cli
geminid
> Give me a summary of all of the changes that went in yesterday
```

### 🌟 Popular Tasks

#### ⌨️ Explore a new codebase

Start by entering an existing or newly cloned repository and running `geminid`.

```text
> Describe the main parts of this system's architecture.
```

```text
> What security mechanisms are in place?
```

```text
> Provide a step-by-step dev onboarding doc for developers new to the codebase.
```

```text
> Summarize this codebase and highlight the most interesting patterns or techniques I could learn from.
```

```text
> Identify potential areas for improvement or refactoring in this codebase, highlighting parts that appear fragile, complex, or hard to maintain.
```

```text
> Which parts of this codebase might be challenging to scale or debug?
```

```text
> Generate a README section for the [module name] module explaining what it does and how to use it.
```

```text
> What kind of error handling and logging strategies does the project use?
```

```text
> Which tools, libraries, and dependencies are used in this project?
```

#### ⌨️ Work with your existing code

```text
> Implement a first draft for GitHub issue #123.
```

```text
> Help me migrate this codebase to the latest Java version. Start with a plan.
```

#### ⌨️ Automate your workflows

Use MCP servers to integrate your local system tools with your enterprise collaboration suite.

```text
> Create a slide deck showing the git history for the last 7 days, grouped by feature and team member.
```

```text
> Create a full-screen web app for a wall display to show our most interacted GitHub issues.
```

#### ⌨️ Interact with your system

```text
> Convert all images in this directory to png and rename them to use exif data dates.
```

```text
> Organize my PDF invoices by expense month.
```

## ⛔ Uninstall

To uninstall the Geminid CLI:

```bash
npm uninstall -g @hahnd/geminid
```

## 📝 Terms of Service and Privacy Notice

For details on the terms of service and privacy notice applicable to your use of the Gemini CLI, refer to the [Terms of Service and Privacy Notice](./docs/tos-privacy.md).
