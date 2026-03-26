import { openai } from "../config/openai";
import fs         from "fs";

export const transcriptionService = {
  transcribe: async (audioBuffer: Buffer, filename: string): Promise<string> => {
    const file = new File([audioBuffer], filename, { type: "audio/webm" });

    const response = await openai.audio.transcriptions.create({
      file,
      model:    "whisper-1",
      language: "en",
    });

    return response.text;
  },
};