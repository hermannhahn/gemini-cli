# Instruction Tool (`save_instruction`)

This document describes the `save_instruction` tool for the Gemini CLI.

## Description

Use `save_instruction` to save and recall information across your Gemini CLI sessions. With `save_instruction`, you can direct the CLI to remember key details across sessions, providing personalized and directed assistance.

### Arguments

`save_instruction` takes one argument:

- `instruction` (string, required): The specific instruction or piece of information to remember. This should be a clear, self-contained statement written in natural language.

## How to use `save_instruction` with the Gemini CLI

The tool appends the provided `instruction` to a special `GEMINI.md` file located in the user's home directory (`~/.gemini/GEMINI.md`). This file can be configured to have a different name.

From the CLI, this tool is invoked by the `/instruction add` command.

Once added, the instructions are stored under a `## Gemini Added Instructions` section. This file is loaded as context in subsequent sessions, allowing the CLI to recall the saved information.

Usage:

```
save_instruction(instruction="Your instruction here.")
```

### `save_instruction` examples

Remember a user preference:

```
save_instruction(instruction="My preferred programming language is Python.")
```

Store a project-specific detail:

```
save_instruction(instruction="The project I'm currently working on is called 'gemini-cli'.")
```

## Important notes

- **General usage:** This tool should be used for concise, important instructions. It is not intended for storing large amounts of data or conversational history.
- **Context file:** The context file is a plain text Markdown file, so you can view and edit it manually if needed.
