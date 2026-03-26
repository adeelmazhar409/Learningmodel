import { Request, Response, NextFunction } from "express";
import { recordingsService } from "../services/recordings.service";
import { sendSuccess, sendCreated } from "../utils/response";

export const recordingsController = {

  /* POST /api/recordings/upload */
  upload: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, message: "No audio file provided" });
        return;
      }
      const { title } = req.body;
      const recording = await recordingsService.upload(req.userId, file, title);
      sendCreated(res, { recording });
    } catch (err) { next(err); }
  },

  /* GET /api/recordings */
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordings = await recordingsService.list(req.userId);
      sendSuccess(res, { recordings });
    } catch (err) { next(err); }
  },

  /* GET /api/recordings/:id */
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recording = await recordingsService.getById(req.userId, req.params.id);
      sendSuccess(res, { recording });
    } catch (err) { next(err); }
  },

  /* GET /api/recordings/:id/status */
  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await recordingsService.getStatus(req.userId, req.params.id);
      sendSuccess(res, status);
    } catch (err) { next(err); }
  },
};
