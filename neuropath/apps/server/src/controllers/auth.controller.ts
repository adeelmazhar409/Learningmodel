import { Request, Response, NextFunction } from "express";
import { authService }   from "../services/auth.service";
import { sendSuccess, sendCreated } from "../utils/response";

export const authController = {

  /* POST /api/auth/signup */
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.signup(req.body);
      sendCreated(res, result);
    } catch (err) { next(err); }
  },

  /* POST /api/auth/login */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  /* DELETE /api/auth/logout */
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.userId);
      sendSuccess(res, { message: "Signed out successfully" });
    } catch (err) { next(err); }
  },
};
