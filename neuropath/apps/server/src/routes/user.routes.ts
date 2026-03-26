import { Router }         from "express";
import { z }              from "zod";
import { userController } from "../controllers/user.controller";
import { validate }       from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

/*
  What this file does:
  --------------------
  Defines the two user profile endpoints.
  Both require the user to be logged in (authMiddleware).

  Routes defined here:
  --------------------
  GET   /api/user/profile   → Return the logged-in user's profile
  PATCH /api/user/profile   → Update name or grade level

  Why PATCH and not PUT?
  ----------------------
  PUT replaces the entire resource.
  PATCH updates only the fields you send.

  A student might only want to update their grade_level.
  With PATCH they send { "grade_level": 10 } and only that
  field changes. With PUT they would have to send the entire
  user object every time.
*/

const updateProfileSchema = z.object({
  name:        z.string().min(1).max(100).optional(),
  grade_level: z.number().int().min(5).max(12).optional(),
}).refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field (name or grade_level) must be provided" }
);

export const userRoutes = Router();

/* All user routes require authentication */
userRoutes.use(authMiddleware);

/* GET /api/user/profile */
userRoutes.get(
  "/profile",
  userController.getProfile,
);

/* PATCH /api/user/profile */
userRoutes.patch(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile,
);
