import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { sendSuccess }  from "../utils/response";

export const userController = {

  /* GET /api/user/profile */
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.userId);
      sendSuccess(res, { user });
    } catch (err) { next(err); }
  },

  /* PATCH /api/user/profile */
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.updateProfile(req.userId, req.body);
      sendSuccess(res, { user });
    } catch (err) { next(err); }
  },
};
