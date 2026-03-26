import { Request, Response, NextFunction } from "express";
import { roadmapService } from "../services/roadmap.service";
import { sendSuccess, sendCreated } from "../utils/response";

export const roadmapController = {

  /* POST /api/roadmap/generate */
  generate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roadmap = await roadmapService.generate(req.userId, req.body);
      sendCreated(res, { roadmap });
    } catch (err) { next(err); }
  },

  /* GET /api/roadmap */
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roadmap = await roadmapService.get(req.userId);
      sendSuccess(res, { roadmap });
    } catch (err) { next(err); }
  },

  /* GET /api/roadmap/today */
  getToday: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapService.getTodaysTasks(req.userId);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  /* POST /api/roadmap/tasks/:id/complete */
  completeTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roadmapService.completeTask(req.userId, req.params.id);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },
};
