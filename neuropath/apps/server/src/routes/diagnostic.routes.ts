import { Router, Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { authMiddleware } from "../middleware/auth.middleware";
import { usersDb } from "../db/users.db";

/*
  Diagnostic routes — SIMPLE VERSION
  ====================================
  All questions live in the frontend (diagnostic.api.ts).
  This server does ONE thing only: save the result when the test is done.

  Routes:
    POST /api/diagnostic/submit   — save scores + update user learning profile
    GET  /api/diagnostic/latest   — return the user's most recent result (optional)
*/

/* ── Validation ── */
const methodScoreSchema = z.object({
  accuracy: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  retention: z.number().min(0).max(100),
  final: z.number().min(0).max(100),
});

const submitSchema = z.object({
  grade_band: z.enum(["5-6", "7-8", "9-10", "11-12"]),
  scores: z.object({
    flashcards: methodScoreSchema,
    practice: methodScoreSchema,
    visual: methodScoreSchema,
    teach_back: methodScoreSchema,
  }),
  learning_profile: z.object({
    flashcards: z.number().min(0).max(1),
    practice: z.number().min(0).max(1),
    visual: z.number().min(0).max(1),
    teach_back: z.number().min(0).max(1),
  }),
  primary_method: z.enum(["flashcards", "practice", "visual", "teach_back"]),
  secondary_method: z.enum(["flashcards", "practice", "visual", "teach_back"]),
});

/* ── Router ── */
export const diagnosticRoutes = Router();

diagnosticRoutes.use(authMiddleware);

/*
  POST /api/diagnostic/submit
  Body: { grade_band, scores, learning_profile, primary_method, secondary_method }
  Response: { result_id, learning_profile }
*/
diagnosticRoutes.post("/submit", async (req: Request, res: Response) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid payload" });
    return;
  }

  const {
    grade_band,
    scores,
    learning_profile,
    primary_method,
    secondary_method,
  } = parsed.data;
  const userId = req.userId;

  /* 1. Save the result row */
  const { data: result, error } = await supabase
    .from("diagnostic_results")
    .insert({
      user_id: userId,
      grade_band,
      scores,
      learning_profile,
      primary_method,
      secondary_method,
    })
    .select("id")
    .single();

  if (error) {
    res.status(500).json({ success: false, message: "Could not save result" });
    return;
  }

  /* 2. Update the user's learning profile so study packs use it */
  await usersDb.update(userId, { learning_profile } as any);

  res.status(200).json({
    success: true,
    data: {
      result_id: result.id,
      learning_profile,
      primary_method,
      secondary_method,
    },
  });
});

/*
  GET /api/diagnostic/latest
  Returns the user's most recent diagnostic result (used by dashboard to show profile).
*/
diagnosticRoutes.get("/latest", async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("diagnostic_results")
    .select("*")
    .eq("user_id", req.userId)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    res.status(200).json({ success: true, data: { result: null } });
    return;
  }

  res.status(200).json({ success: true, data: { result: data } });
});
