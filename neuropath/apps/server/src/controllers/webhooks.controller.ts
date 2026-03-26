import { Request, Response, NextFunction } from "express";
import { recordingsService } from "../services/recordings.service";
import { generationService } from "../services/generation.service";
import { recordingsDb }      from "../db/recordings.db";
import { logger }            from "../utils/logger";

export const webhooksController = {

  /*
    POST /api/webhooks/transcription
    Called by AssemblyAI when a transcription job completes.

    Payload from AssemblyAI:
    {
      status:         "completed" | "error",
      transcript_id:  "abc123",
      text:           "The full transcript text...",
      error?:         "Error message if failed"
    }
  */
  transcription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, transcript_id, text, error } = req.body;

      logger.info(`Transcription webhook received: ${transcript_id} → ${status}`);

      /* Find the recording that corresponds to this transcript */
      const recording = await recordingsDb.findByTranscriptId(transcript_id);
      if (!recording) {
        logger.warn(`No recording found for transcript_id: ${transcript_id}`);
        res.status(200).json({ received: true }); // Always 200 to AssemblyAI
        return;
      }

      if (status === "error") {
        await recordingsDb.updateStatus(recording.id, "failed");
        res.status(200).json({ received: true });
        return;
      }

      if (status === "completed" && text) {
        /* Save transcript and mark as transcribed */
        await recordingsDb.saveTranscript(recording.id, text);

        /* Kick off AI study pack generation in the background */
        generationService
          .generateStudyPack(recording.id, recording.user_id, text)
          .catch(err => logger.error("Study pack generation failed:", err));
      }

      /* Always respond 200 immediately — AssemblyAI will retry on non-200 */
      res.status(200).json({ received: true });
    } catch (err) {
      logger.error("Webhook handler error:", err);
      res.status(200).json({ received: true }); // Still 200 — don't trigger retries
    }
  },
};
