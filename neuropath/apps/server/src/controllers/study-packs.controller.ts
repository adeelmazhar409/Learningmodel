import { Request, Response, NextFunction } from "express";
import { studyPacksService } from "../services/study-packs.service";
import { sendSuccess } from "../utils/response";

export const studyPacksController = {

  /* GET /api/study-packs */
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit  = req.query.limit  ? parseInt(req.query.limit  as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const packs  = await studyPacksService.list(req.userId, { limit, offset });
      sendSuccess(res, { packs });
    } catch (err) { next(err); }
  },

  /* GET /api/study-packs/:id */
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pack = await studyPacksService.getById(req.userId, req.params.id);
      sendSuccess(res, { pack });
    } catch (err) { next(err); }
  },
};
