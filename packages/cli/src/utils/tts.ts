/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import axios from 'axios';

const execPromise = promisify(exec);

let isAudioPlaying = false;

/**
 * Generates and plays audio from text using Microsoft TTS API.
 * @param text The text to convert to speech.
 */
export async function generateAndPlayTts(
  text: string,
  options?: { language?: string; voiceName?: string },
): Promise<void> {
  const ttsKey = process.env.MICROSOFT_TTS_KEY;
  const ttsRegion = process.env.MICROSOFT_TTS_REGION;
  const ttsVoice =
    options?.voiceName ||
    process.env.MICROSOFT_TTS_VOICE ||
    'en-US-JennyNeural'; // Default voice
  const ttsLanguage =
    options?.language || process.env.MICROSOFT_TTS_LANGUAGE || 'en-US';

  if (!ttsKey || !ttsRegion) {
    console.warn(
      'Microsoft TTS environment variables (MICROSOFT_TTS_KEY, MICROSOFT_TTS_REGION) are not set. Skipping TTS.',
    );
    return;
  }

  let tempFilePath: string | undefined;
  try {
    if (isAudioPlaying) {
      console.log('Audio already playing, skipping new TTS request.');
      return;
    }
    isAudioPlaying = true;
    // 1. Make HTTP request to Microsoft TTS API
    const ssml = `<speak version='1.0' xml:lang='${ttsLanguage}'><voice name='${ttsVoice}'>${text}</voice></speak>`;
    const response = await axios.post(
      `https://${ttsRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      ssml,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': ttsKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'riff-16khz-16bit-mono-pcm',
          'User-Agent': 'gemini-cli',
        },
        responseType: 'arraybuffer',
      },
    );
    const audioData = Buffer.from(response.data);

    // 2. Save the returned audio data to a temporary file
    tempFilePath = path.join(os.tmpdir(), `gemini_tts_${Date.now()}.mp3`);
    fs.writeFileSync(tempFilePath, audioData);

    // 3. Audio Playback
    let playCommand: string;
    switch (os.platform()) {
      case 'darwin': // macOS
        playCommand = `afplay "${tempFilePath}"`;
        break;
      case 'linux': // Linux
        playCommand = `aplay "${tempFilePath}"`;
        break;
      case 'win32': // Windows
        console.warn(
          'Audio playback on Windows is not directly supported by this utility. Please install a player like ffplay and update the code.',
        );
        playCommand = `echo "Playback not supported on Windows without external player."`;
        break;
      default:
        console.warn(`Unsupported OS for audio playback: ${os.platform()}`);
        return;
    }

    await execPromise(playCommand);
    console.log('TTS audio played.');
  } catch (error) {
    console.error('Error during TTS generation or playback:', error);
  } finally {
    // 4. Cleanup: Delete the temporary audio file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log('Temporary TTS file cleaned up.');
    }
    isAudioPlaying = false;
  }
}
