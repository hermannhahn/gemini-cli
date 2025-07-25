# Feature: Narrator

## Overview

The Narrator feature provides audio feedback for the Gemini CLI, with three distinct modes of operation:

1.  **Off**: No audio narration.
2.  **Acts**: Narrates the AI model's actions (tool calls, thoughts) as they occur.
3.  **Response**: Narrates a summary, observation, or important warning about the AI model's response, provided by the model itself.

Users can switch between these modes using a new `/narrator` CLI command (e.g., `/narrator off`, `/narrator acts`, `/narrator response`).

## Technical Details

### 1. Define Narrator State

- A new `useState` will be added to `packages/cli/src/ui/App.tsx` to manage the current Narrator mode (`off`, `acts`, `response`).

### 2. Implement `/narrator` Command

- Modify `packages/cli/src/ui/hooks/slashCommandProcessor.ts` to recognize and process the `/narrator` command.
- The command logic will update the Narrator state based on the provided argument (`off`, `acts`, `response`).
- Display informative messages in the CLI history about the Narrator mode change.

### 3. Microsoft TTS API Integration

- Create a new utility file: `packages/cli/src/utils/tts.ts`.
- This file will contain an asynchronous function `generateAndPlayTts(text: string)`:
  - **Environment Variables**: Check for `MICROSOFT_TTS_KEY`, `MICROSOFT_TTS_REGION`, and `MICROSOFT_TTS_VOICE`.
  - **API Request**: Make an HTTP request to the Microsoft TTS API.
  - **Audio Storage**: Save the returned audio data to a temporary file (using `node:fs` and `node:os` for temporary directories).
  - **Audio Playback**: Use `node:child_process` to play the audio file (e.g., `aplay` on Linux, `afplay` on macOS, or a suitable media player on Windows).
  - **Cleanup**: Delete the temporary audio file after playback.
- Implement robust error handling for API calls and audio playback.

### 4. Implement Action Narrator (`acts` mode)

- In `packages/cli/src/ui/hooks/useGeminiStream.ts`, observe the `thought` variable.
- If the Narrator mode is `acts` and `thought` is updated, call `generateAndPlayTts(thought)`.

### 5. Implement Response Narrator (`response` mode)

- **Modify Model Prompt**: This is a critical step. The prompt sent to the Gemini model needs to be augmented.
  - In `packages/cli/src/ui/hooks/useGeminiStream.ts` (or an earlier layer where the prompt is constructed), if the Narrator mode is `response`, append an instruction to the user's prompt. Example instruction: "Please provide a brief summary/observation of your response at the end, prefixed with 'NARRATOR_SUMMARY:'".
- **Extract Summary from Response**: After receiving the model's response, parse the text to find the `NARRATOR_SUMMARY:` prefix and extract the content that follows.
- Call `generateAndPlayTts(extractedSummary)`.

### 6. Temporary File Management

- Ensure the `generateAndPlayTts` function reliably deletes temporary audio files after they have been played.
