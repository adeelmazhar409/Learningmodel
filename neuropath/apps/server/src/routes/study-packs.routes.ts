import { Router }              from "express";
import { studyPacksController } from "../controllers/study-packs.controller";
import { authMiddleware }      from "../middleware/auth.middleware";

/*
  What this file does:
  --------------------
  Defines endpoints for reading study packs.

  Study packs are GENERATED automatically after transcription
  completes. They are never created directly by the user.
  So all routes here are GET only.

  Routes defined here:
  --------------------
  GET /api/study-packs
    -> Returns all study packs for the logged-in user
       Supports optional ?limit= and ?offset= query params for pagination

  GET /api/study-packs/:id
    -> Returns a single complete study pack including:
       summary_short, summary_bullets, flashcards, quiz, teach_back
*/

export const studyPacksRoutes = Router();

studyPacksRoutes.use(authMiddleware);

/* GET /api/study-packs */
studyPacksRoutes.get("/", studyPacksController.list);

/* GET /api/study-packs/:id */
studyPacksRoutes.get("/:id", studyPacksController.getById);
