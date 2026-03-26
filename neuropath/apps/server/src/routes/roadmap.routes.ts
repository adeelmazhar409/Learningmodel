import { Router }           from "express";
import { z }                from "zod";
import { roadmapController } from "../controllers/roadmap.controller";
import { validate }         from "../middleware/validate.middleware";
import { authMiddleware }   from "../middleware/auth.middleware";

/*
  What this file does:
  --------------------
  Defines the roadmap endpoints that power the study planner.

  Routes defined here:
  --------------------
  POST /api/roadmap/generate
    -> Takes a subject and test_date, builds a day-by-day task list
       personalised to the user's learning profile

  GET  /api/roadmap
    -> Returns the current roadmap with all tasks

  GET  /api/roadmap/today
    -> Returns only today's tasks (used on the dashboard)

  POST /api/roadmap/tasks/:id/complete
    -> Marks a task as done, returns the updated task
       plus a coaching message to show the student
*/

const generateSchema = z.object({
  subject:   z.string().min(1, "Subject is required"),
  test_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "test_date must be in YYYY-MM-DD format")
    .refine(date => new Date(date) > new Date(), {
      message: "test_date must be in the future",
    }),
});

export const roadmapRoutes = Router();

roadmapRoutes.use(authMiddleware);

/* POST /api/roadmap/generate */
roadmapRoutes.post("/generate", validate(generateSchema), roadmapController.generate);

/* GET /api/roadmap */
roadmapRoutes.get("/", roadmapController.get);

/* GET /api/roadmap/today */
roadmapRoutes.get("/today", roadmapController.getToday);

/* POST /api/roadmap/tasks/:id/complete */
roadmapRoutes.post("/tasks/:id/complete", roadmapController.completeTask);
