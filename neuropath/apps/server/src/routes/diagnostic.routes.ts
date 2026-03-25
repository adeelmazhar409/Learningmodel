import { Router }               from "express";
import { z }                    from "zod";
import { diagnosticController } from "../controllers/diagnostic.controller";
import { validate }             from "../middleware/validate.middleware";
import { authMiddleware }       from "../middleware/auth.middleware";

/*
  What this file does:
  --------------------
  Defines the diagnostic endpoints that power the 20-minute
  learning assessment.

  Routes defined here:
  --------------------
  POST /api/diagnostic/start
    → Creates a new attempt, returns questions for all 4 rounds
      and the 20 recall questions

  POST /api/diagnostic/submit
    → Receives all answers, runs the scoring algorithm,
      saves the learning profile to the user record,
      returns scores and the new profile

  GET  /api/diagnostic/attempts/:id
    → Returns a past attempt by ID (for reviewing results)

  The answer schema:
  ------------------
  Each answer object must include:
  - question_id (string)
  - method      (which learning round the question came from)
  - correct     (did the student get it right?)
  - time_ms     (how long they took in milliseconds)
  - user_answer (what they actually answered)
*/

const startSchema = z.object({
  subject:    z.string().min(1, "Subject is required"),
  grade_band: z.enum(["5-6", "7-8", "9-10", "11-12"], {
    errorMap: () => ({ message: "grade_band must be one of: 5-6, 7-8, 9-10, 11-12" }),
  }),
});

const answerSchema = z.object({
  question_id: z.string().min(1),
  method:      z.enum(["flashcards", "practice", "visual", "teach_back"]),
  correct:     z.boolean(),
  time_ms:     z.number().int().min(0),
  user_answer: z.string(),
});

const submitSchema = z.object({
  attempt_id: z.string().min(1, "attempt_id is required"),
  answers:    z.array(answerSchema).min(1, "At least one answer is required"),
});

export const diagnosticRoutes = Router();

/* All diagnostic routes require authentication */
diagnosticRoutes.use(authMiddleware);

/* POST /api/diagnostic/start */
diagnosticRoutes.post(
  "/start",
  validate(startSchema),
  diagnosticController.start,
);

/* POST /api/diagnostic/submit */
diagnosticRoutes.post(
  "/submit",
  validate(submitSchema),
  diagnosticController.submit,
);

/* GET /api/diagnostic/attempts/:id */
diagnosticRoutes.get(
  "/attempts/:id",
  diagnosticController.getAttempt,
);