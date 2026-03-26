import { supabase }              from "../config/supabase";
import { env }                   from "../config/env";
import { transcriptionService }  from "./transcription.service";
import { recordingsDb }          from "../db/recordings.db";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { logger }                from "../utils/logger";
import type { Recording, RecordingStatusResponse } from "@neuropath/types";

export const recordingsService = {

  /* Upload audio to Supabase Storage and kick off transcription */
  upload: async (
    userId: string,
    file:   Express.Multer.File,
    title:  string,
  ): Promise<Recording> => {
    const fileName = `${userId}/${Date.now()}-${file.originalname}`;

    /* Upload to Supabase Storage */
    const { error: uploadError } = await supabase.storage
      .from("recordings")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert:      false,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    /* Get public URL */
    const { data: urlData } = supabase.storage
      .from("recordings")
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;

    /* Create recording record in database */
    const recording = await recordingsDb.create({
      user_id:  userId,
      title:    title || "Untitled lecture",
      file_url: fileUrl,
      status:   "transcribing",
    });

    /* Submit to AssemblyAI — don't await, it runs in background */
    const webhookUrl = `${env.FRONTEND_URL.replace("3000", "4000")}/api/webhooks/transcription`;
    transcriptionService
      .submit(fileUrl, webhookUrl)
      .then(transcriptId => recordingsDb.saveTranscriptId(recording.id, transcriptId))
      .catch(err => {
        logger.error("Transcription submission failed:", err);
        recordingsDb.updateStatus(recording.id, "failed");
      });

    return recording;
  },

  /* Get all recordings for a user */
  list: async (userId: string): Promise<Recording[]> => {
    return recordingsDb.findByUserId(userId);
  },

  /* Get a single recording */
  getById: async (userId: string, recordingId: string): Promise<Recording> => {
    const recording = await recordingsDb.findById(recordingId);
    if (!recording)               throw new NotFoundError("Recording not found");
    if (recording.user_id !== userId) throw new ForbiddenError();
    return recording;
  },

  /* Get status and progress of a recording */
  getStatus: async (userId: string, recordingId: string): Promise<RecordingStatusResponse> => {
    const recording = await recordingsDb.findById(recordingId);
    if (!recording)               throw new NotFoundError("Recording not found");
    if (recording.user_id !== userId) throw new ForbiddenError();

    const progressMap: Record<string, number> = {
      uploading:    20,
      transcribing: 50,
      generating:   80,
      ready:        100,
      failed:       0,
    };

    const messageMap: Record<string, string> = {
      uploading:    "Uploading audio…",
      transcribing: "Transcribing lecture…",
      generating:   "Generating study pack…",
      ready:        "Your study pack is ready!",
      failed:       "Something went wrong. Please try again.",
    };

    return {
      recording_id: recordingId,
      status:       recording.status,
      progress:     progressMap[recording.status] ?? 0,
      message:      messageMap[recording.status]  ?? "",
    };
  },
};
