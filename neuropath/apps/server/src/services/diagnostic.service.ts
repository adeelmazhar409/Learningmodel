import { supabase }       from "../config/supabase";
import { usersDb }        from "../db/users.db";
import { scoringService } from "./scoring.service";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import type {
  StartDiagnosticPayload,
  StartDiagnosticResponse,
  SubmitDiagnosticPayload,
  SubmitDiagnosticResponse,
  DiagnosticAttempt,
  DiagnosticQuestion,
} from "@neuropath/types";

export const diagnosticService = {

  /* Start a new diagnostic — fetch questions and create an attempt record */
  start: async (
    userId:  string,
    payload: StartDiagnosticPayload,
  ): Promise<StartDiagnosticResponse> => {
    const { subject, grade_band } = payload;

    /* Fetch questions for this grade band from the database */
    const { data: questions, error } = await supabase
      .from("diagnostic_questions")
      .select("*")
      .eq("grade_band", grade_band)
      .eq("active", true);

    if (error) throw new Error("Could not load diagnostic questions");

    /* Separate into learning round questions and recall questions */
    const roundQuestions  = questions as DiagnosticQuestion[];
    const recallQuestions = shuffleArray([...roundQuestions]).slice(0, 20);

    /* Create the attempt record */
    const { data: attempt, error: attemptError } = await supabase
      .from("diagnostic_attempts")
      .insert({
        user_id:     userId,
        subject,
        grade_band,
        started_at:  new Date().toISOString(),
        status:      "in_progress",
      })
      .select()
      .single();

    if (attemptError) throw new Error("Could not create diagnostic attempt");

    return {
      attempt_id:       attempt.id,
      round_questions:  roundQuestions,
      recall_questions: recallQuestions,
    };
  },

  /* Submit answers, score them, save the learning profile */
  submit: async (
    userId:  string,
    payload: SubmitDiagnosticPayload,
  ): Promise<SubmitDiagnosticResponse> => {
    const { attempt_id, answers } = payload;

    /* Verify the attempt belongs to this user */
    const { data: attempt } = await supabase
      .from("diagnostic_attempts")
      .select("*")
      .eq("id", attempt_id)
      .eq("user_id", userId)
      .single();

    if (!attempt) throw new NotFoundError("Diagnostic attempt not found");

    /* Run the scoring algorithm */
    const { scores, primary_method, secondary_method, learning_profile } =
      scoringService.score(answers);

    /* Save scored attempt */
    await supabase
      .from("diagnostic_attempts")
      .update({
        answers:          answers,
        scores:           scores,
        primary_method,
        secondary_method,
        completed_at:     new Date().toISOString(),
        status:           "completed",
      })
      .eq("id", attempt_id);

    /* Save learning profile to user record */
    await usersDb.update(userId, { learning_profile } as any);

    return { scores, primary_method, secondary_method, learning_profile };
  },

  /* Get a past attempt by ID */
  getAttempt: async (userId: string, attemptId: string): Promise<DiagnosticAttempt> => {
    const { data: attempt, error } = await supabase
      .from("diagnostic_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (error || !attempt) throw new NotFoundError("Attempt not found");
    if (attempt.user_id !== userId) throw new ForbiddenError();

    return attempt as DiagnosticAttempt;
  },
};

/* Fisher-Yates shuffle */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
