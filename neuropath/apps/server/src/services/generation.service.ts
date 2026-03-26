import { chatComplete }   from "../config/openai";
import { recordingsDb }   from "../db/recordings.db";
import { studyPacksDb }   from "../db/study-packs.db";
import { usersDb }        from "../db/users.db";
import { logger }         from "../utils/logger";
import type { LearningProfile } from "@neuropath/types";

export const generationService = {

  /*
    Generate a full study pack from a transcript.
    Called after transcription completes — runs entirely in the background.
  */
  generateStudyPack: async (
    recordingId: string,
    userId:      string,
    transcript:  string,
  ): Promise<void> => {
    logger.info(`Starting study pack generation for recording: ${recordingId}`);

    /* Update status to generating */
    await recordingsDb.updateStatus(recordingId, "generating");

    /* Get the user's learning profile */
    const user    = await usersDb.findById(userId);
    const profile = user?.learning_profile ?? { practice: 0.25, teach_back: 0.25, flashcards: 0.25, visual: 0.25 };

    /* Get recording title */
    const recording = await recordingsDb.findById(recordingId);
    if (!recording) throw new Error("Recording not found");

    try {
      /* Run all prompts */
      const [summary, flashcards, quiz, teachBack] = await Promise.all([
        generateSummary(transcript),
        generateFlashcards(transcript, profile),
        generateQuiz(transcript, profile),
        generateTeachBack(transcript, profile),
      ]);

      /* Save the study pack */
      await studyPacksDb.create({
        user_id:          userId,
        recording_id:     recordingId,
        title:            recording.title,
        summary_short:    summary.short,
        summary_bullets:  summary.bullets,
        flashcards:       flashcards,
        quiz:             quiz,
        teach_back:       teachBack,
        flashcard_count:  flashcards.length,
        quiz_count:       quiz.length,
        profile_snapshot: profile,
        status:           "ready",
      });

      /* Mark recording as ready */
      await recordingsDb.updateStatus(recordingId, "ready");
      logger.info(`Study pack generated successfully for recording: ${recordingId}`);

    } catch (err) {
      logger.error(`Generation failed for recording ${recordingId}:`, err);
      await recordingsDb.updateStatus(recordingId, "failed");
      throw err;
    }
  },
};

/* ── Individual generation prompts ── */

async function generateSummary(transcript: string) {
  const system = `You are an expert educational content creator.
Given a lecture transcript, extract the key information.
Respond ONLY with valid JSON in this exact format — no markdown, no explanation:
{
  "short": "One paragraph summary (2-3 sentences)",
  "bullets": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5", "Key point 6"]
}`;

  const raw  = await chatComplete(system, `Transcript:\n${transcript}`, 800);
  const data = safeParseJSON(raw);
  return { short: data.short ?? "", bullets: data.bullets ?? [] };
}

async function generateFlashcards(transcript: string, profile: LearningProfile) {
  const count  = Math.max(4, Math.round(8 * profile.flashcards * 4));
  const system = `You are an expert at creating educational flashcards.
Generate exactly ${count} flashcards from this lecture transcript.
Weight towards active recall — questions that test understanding, not just memory.
Respond ONLY with valid JSON array — no markdown, no explanation:
[
  { "id": "fc1", "question": "...", "answer": "...", "difficulty": "easy" },
  { "id": "fc2", "question": "...", "answer": "...", "difficulty": "medium" }
]
Difficulty must be: easy, medium, or hard.`;

  const raw  = await chatComplete(system, `Transcript:\n${transcript}`, 1200);
  return safeParseJSON(raw) ?? [];
}

async function generateQuiz(transcript: string, profile: LearningProfile) {
  const count  = Math.max(3, Math.round(5 * profile.practice * 4));
  const system = `You are an expert at creating educational quizzes.
Generate exactly ${count} multiple choice questions from this transcript.
Each question must test actual understanding of the content.
Respond ONLY with valid JSON array — no markdown, no explanation:
[
  {
    "id": "qz1",
    "type": "mcq",
    "question": "...",
    "choices": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }
]`;

  const raw  = await chatComplete(system, `Transcript:\n${transcript}`, 1500);
  return safeParseJSON(raw) ?? [];
}

async function generateTeachBack(transcript: string, profile: LearningProfile) {
  const length = profile.teach_back > 0.3 ? "detailed (4-5 paragraphs)" : "concise (2-3 paragraphs)";
  const system = `You are an expert educator who creates teach-back scripts.
Write a ${length} explanation of the lecture content as if explaining to a classmate.
Use simple, clear language. No jargon without explanation.
Respond ONLY with the plain text script — no JSON, no markdown headings.`;

  return await chatComplete(system, `Transcript:\n${transcript}`, 1000);
}

/* Safe JSON parse — returns null if parsing fails */
function safeParseJSON(raw: string): any {
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
