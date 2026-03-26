import { Request, Response, NextFunction } from "express";
import { diagnosticService } from "../services/diagnostic.service";
import { sendSuccess, sendCreated } from "../utils/response";

export const diagnosticController = {

  /* POST /api/diagnostic/start */
  start: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await diagnosticService.start(req.userId, req.body);
      sendCreated(res, result);
    } catch (err) { next(err); }
  },

  /* POST /api/diagnostic/submit */
  submit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await diagnosticService.submit(req.userId, req.body);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  /* GET /api/diagnostic/attempts/:id */
  getAttempt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attempt = await diagnosticService.getAttempt(req.userId, req.params.id);
      sendSuccess(res, { attempt });
    } catch (err) { next(err); }
  },
};
