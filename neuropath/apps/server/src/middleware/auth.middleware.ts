import { Request, Response, NextFunction } from "express";
import { supabaseAuthClient } from "../config/supabase"; // anon key — safe for JWT verification
import { AppError } from "../utils/errors";
import { logger }   from "../utils/logger";

/*
  What this file does:
  --------------------
  Every protected route runs this middleware FIRST before reaching
  the controller. It reads the Authorization header, validates the
  token with Supabase, and attaches the user's ID to the request.

  Why supabaseAuthClient and not supabase (service role)?
  -------------------------------------------------------
  Calling getUser(token) on the service role client causes Supabase
  to silently inject the user's JWT as the active session on that
  shared client instance. Every subsequent DB/Storage call from that
  client would then use the user JWT instead of the service role key,
  causing RLS violations.

  supabaseAuthClient uses the anon key and is only ever used here —
  it verifies the JWT without contaminating the service role client.
*/

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function authMiddleware(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    /* ── 1. Read the Authorization header ── */
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header", 401);
    }

    const token = authHeader.slice(7);

    /* ── 2. Verify JWT using the anon key client ONLY ── */
    const { data, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !data.user) {
      logger.warn("Auth failed:", error?.message ?? "No user returned");
      throw new AppError("Invalid or expired token", 401);
    }

    /* ── 3. Attach userId for controllers to use ── */
    req.userId = data.user.id;

    next();
  } catch (err) {
    next(err);
  }
}