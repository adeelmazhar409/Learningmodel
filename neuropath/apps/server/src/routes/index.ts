import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { diagnosticRoutes } from "./diagnostic.routes"; // ← new simple version
import { recordingsRoutes } from "./recordings.routes";
import { studyPacksRoutes } from "./study-packs.routes";
import { roadmapRoutes } from "./roadmap.routes";
import { webhooksRoutes } from "./webhooks.routes";
import { userRoutes } from "./user.routes";

/*
  All routes prefixed with /api (set in index.ts via app.use("/api", router))

  Diagnostic is now simple:
    POST /api/diagnostic/submit  — save scores after test completes
    GET  /api/diagnostic/latest  — fetch last result (optional)

  Questions are NEVER fetched from the server.
  All question data lives in the frontend (diagnostic.api.ts).
*/
export const router = Router();

router.use("/auth", authRoutes);
router.use("/diagnostic", diagnosticRoutes);
router.use("/recordings", recordingsRoutes);
router.use("/study-packs", studyPacksRoutes);
router.use("/roadmap", roadmapRoutes);
router.use("/webhooks", webhooksRoutes);
router.use("/user", userRoutes);
