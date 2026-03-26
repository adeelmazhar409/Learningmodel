import { Router } from "express";
import { authRoutes }        from "./auth.routes";
import { diagnosticRoutes }  from "./diagnostic.routes";
import { recordingsRoutes }  from "./recordings.routes";
import { studyPacksRoutes }  from "./study-packs.routes";
import { roadmapRoutes }     from "./roadmap.routes";
import { webhooksRoutes }    from "./webhooks.routes";

/*
  What this file does:
  --------------------
  This is the single entry point for ALL routes in the server.
  It mounts each feature's router under a prefix.

  The Express app in index.ts does:
    app.use("/api", router)

  So every route defined here is prefixed with /api.

  Final URL structure:
    /api/auth/signup
    /api/auth/login
    /api/diagnostic/start
    /api/recordings/upload
    /api/study-packs
    /api/roadmap/generate
    /api/webhooks/transcription

  Why split into separate routers?
  ---------------------------------
  Each feature (auth, diagnostic, recordings, etc.) has its own
  router file. This keeps things organised — all auth routes in
  one place, all recording routes in another, etc.

  This file just glues them all together.
*/
export const router = Router();

router.use("/auth",        authRoutes);
router.use("/diagnostic",  diagnosticRoutes);
router.use("/recordings",  recordingsRoutes);
router.use("/study-packs", studyPacksRoutes);
router.use("/roadmap",     roadmapRoutes);
router.use("/webhooks",    webhooksRoutes);

/* User profile routes sit directly under /api/user */
import { userRoutes } from "./user.routes";
router.use("/user", userRoutes);
