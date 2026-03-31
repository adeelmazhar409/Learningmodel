import { supabase }              from "../config/supabase";
import { transcriptionService }  from "./transcription.service";
import { generationService }     from "./generation.service";
import { recordingsDb }          from "../db/recordings.db";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { logger }                from "../utils/logger";
import type { Recording, RecordingStatusResponse } from "@neuropath/types";

export const recordingsService = {

  upload: async (
    userId: string,
    file:   Express.Multer.File,
    title:  string,
  ): Promise<Recording> => {
    const fileName = `${userId}/${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("recordings")
      .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("recordings")
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;

    const recording = await recordingsDb.create({
      user_id:  userId,
      title:    title || "Untitled lecture",
      file_url: fileUrl,
      status:   "transcribing",
    });

    /* Run transcription + generation in background */
    processRecording(recording.id, userId, fileUrl, file.originalname)
      .catch(err => {
        logger.error(`Background processing failed for ${recording.id}:`, err);
        recordingsDb.updateStatus(recording.id, "failed");
      });

    return recording;
  },

  list: async (userId: string): Promise<Recording[]> => {
    return recordingsDb.findByUserId(userId);
  },

  getById: async (userId: string, recordingId: string): Promise<Recording> => {
    const recording = await recordingsDb.findById(recordingId);
    if (!recording)                   throw new NotFoundError("Recording not found");
    if (recording.user_id !== userId) throw new ForbiddenError();
    return recording;
  },

  getStatus: async (userId: string, recordingId: string): Promise<RecordingStatusResponse> => {
    const recording = await recordingsDb.findById(recordingId);
    if (!recording)                   throw new NotFoundError("Recording not found");
    if (recording.user_id !== userId) throw new ForbiddenError();

    const progressMap: Record<string, number> = {
      uploading: 20, transcribing: 50, generating: 80, ready: 100, failed: 0,
    };
    const messageMap: Record<string, string> = {
      uploading:    "Uploading audio…",
      transcribing: "Transcribing with Whisper…",
      generating:   "Generating your study pack…",
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

async function processRecording(
  recordingId: string,
  userId:      string,
  fileUrl:     string,
  filename:    string,
): Promise<void> {
  logger.info(`Starting background processing for recording: ${recordingId}`);

  await recordingsDb.updateStatus(recordingId, "transcribing");
  const transcript = await transcriptionService.transcribeUrl(fileUrl, filename);
  await recordingsDb.saveTranscript(recordingId, transcript);

  await generationService.generateStudyPack(recordingId, userId, transcript);
  logger.info(`Processing complete for recording: ${recordingId}`);
}