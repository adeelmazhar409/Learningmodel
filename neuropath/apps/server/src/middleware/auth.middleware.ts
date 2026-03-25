import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { AppError } from "../utils/errors";
import { logger }   from "../utils/logger";

/*
  What this file does:
  --------------------
  Every protected route (anything that needs a logged-in user) runs
  this middleware FIRST before reaching the controller.

  It reads the Authorization header, validates the token with Supabase,
  and attaches the user's ID to the request object.

  If the token is missing or invalid, it throws a 401 error immediately
  and the controller never runs.

  How tokens work:
  ----------------
  When a user logs in, Supabase gives them an access_token (a JWT string).
  The frontend stores this and sends it with every request:
    Authorization: Bearer eyJhbGci...

  This middleware verifies that token is real and not expired.
*/

/* Extend Express's Request type to include our userId field */
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

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    /* ── 2. Verify the token with Supabase ── */
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      logger.warn("Auth failed:", error?.message ?? "No user returned");
      throw new AppError("Invalid or expired token", 401);
    }

    /* ── 3. Attach user ID to the request for controllers to use ── */
    req.userId = data.user.id;

    next();
  } catch (err) {
    next(err);
  }
}