import { Router }           from "express";
import { z }                from "zod";
import { authController }   from "../controllers/auth.controller";
import { validate }         from "../middleware/validate.middleware";
import { authMiddleware }   from "../middleware/auth.middleware";

/*
  What this file does:
  --------------------
  Defines the three authentication endpoints.
  Each route has three layers in order:

  1. validate(schema) — checks the request body is valid
  2. authMiddleware   — (only on logout) checks the user is logged in
  3. controller       — does the actual work

  Routes defined here:
  --------------------
  POST   /api/auth/signup   → Create a new account
  POST   /api/auth/login    → Log in and get a token
  DELETE /api/auth/logout   → Invalidate the current session

  Zod schemas:
  ------------
  Zod schemas define exactly what fields are required and what
  format they must be in. If the request body does not match,
  the validate() middleware returns a 400 error before the
  controller even runs.
*/

const signupSchema = z.object({
  name:     z.string().min(1,  "Name is required").max(100),
  email:    z.string().email("Must be a valid email address"),
  password: z.string().min(8,  "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email:    z.string().email("Must be a valid email address"),
  password: z.string().min(1,  "Password is required"),
});

export const authRoutes = Router();

/* POST /api/auth/signup */
authRoutes.post(
  "/signup",
  validate(signupSchema),
  authController.signup,
);

/* POST /api/auth/login */
authRoutes.post(
  "/login",
  validate(loginSchema),
  authController.login,
);

/* DELETE /api/auth/logout — requires a valid token */
authRoutes.delete(
  "/logout",
  authMiddleware,
  authController.logout,
);