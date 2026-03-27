import { Router }              from "express";
import { webhooksController }  from "../controllers/webhooks.controller";

/*
  What this file does:
  --------------------
  Defines the webhook endpoint that WhisperAI calls when
  transcription is complete.

  How webhooks work:
  ------------------
  When we submit audio to WhisperAI for transcription, we tell
  it: "When you are done, POST the result to this URL."

  WhisperAI then calls our server directly when the transcript
  is ready. This is much better than polling (checking every few
  seconds) because it fires the instant transcription completes.

  Routes defined here:
  --------------------
  POST /api/webhooks/transcription
    -> WhisperAI calls this when a transcript is ready.
       We verify the request came from WhisperAI (security check),
       save the transcript to the database, then trigger AI
       study pack generation as a background job.

  NOTE: This route has NO authMiddleware because it is called by
  WhisperAI, not by a logged-in user. Instead we verify the
  request using WhisperAI's webhook secret.
*/

export const webhooksRoutes = Router();

/* POST /api/webhooks/transcription */
webhooksRoutes.post("/transcription", webhooksController.transcription);
