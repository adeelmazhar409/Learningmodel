import { openai } from "../config/openai";
import { logger } from "../utils/logger";
import { toFile } from "openai";

export const transcriptionService = {

  /*
    Transcribe audio from a URL using OpenAI Whisper.
    Downloads the file first, then sends the buffer directly to OpenAI.
    Retries up to 3 times on network errors.
  */
  transcribeUrl: async (audioUrl: string, filename: string): Promise<string> => {
    logger.info(`Downloading audio: ${audioUrl}`);

    /* Use the native fetch built into Node 18+ to download */
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error(`Could not download audio: ${response.statusText}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    logger.info(`Downloaded ${buffer.length} bytes — sending to Whisper`);

    return transcriptionService.transcribeBuffer(buffer, filename);
  },

  /*
    Transcribe from a raw buffer with retry logic.
    Retries up to 3 times with exponential backoff on connection errors.
  */
  transcribeBuffer: async (
    buffer:   Buffer,
    filename: string,
    attempt = 1,
  ): Promise<string> => {
    try {
      const audioFile = await toFile(buffer, filename, { type: "audio/webm" });

      const result = await openai.audio.transcriptions.create({
        file:     audioFile,
        model:    "whisper-1",
        language: "en",
      });

      logger.info(`Whisper transcription complete: ${result.text.length} characters`);
      return result.text;

    } catch (err: any) {
      const isNetworkError = err?.cause?.code === "ECONNRESET"
        || err?.code === "ECONNRESET"
        || err?.message?.includes("ECONNRESET")
        || err?.message?.includes("network");

      if (isNetworkError && attempt < 3) {
        const delay = attempt * 3000; // 3s, then 6s
        logger.warn(`Whisper connection reset — retrying in ${delay}ms (attempt ${attempt}/3)`);
        await new Promise(r => setTimeout(r, delay));
        return transcriptionService.transcribeBuffer(buffer, filename, attempt + 1);
      }

      throw err;
    }
  },
};