import { Router }               from "express";
import multer                   from "multer";
import { recordingsController } from "../controllers/recordings.controller";
import { authMiddleware }       from "../middleware/auth.middleware";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported. Use webm, mp4, mp3, or wav.`));
    }
  },
});

export const recordingsRoutes = Router();

recordingsRoutes.use(authMiddleware);

/* POST /api/recordings/upload */
recordingsRoutes.post("/upload", upload.single("audio"), recordingsController.upload);

/* GET /api/recordings */
recordingsRoutes.get("/", recordingsController.list);

/* GET /api/recordings/:id */
recordingsRoutes.get("/:id", recordingsController.getById);

/* GET /api/recordings/:id/status */
recordingsRoutes.get("/:id/status", recordingsController.getStatus);
