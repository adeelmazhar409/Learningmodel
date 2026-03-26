import { usersDb } from "../db/users.db";
import { NotFoundError } from "../utils/errors";
import type { User, UpdateProfilePayload } from "@neuropath/types";

export const userService = {

  getProfile: async (userId: string): Promise<User> => {
    const user = await usersDb.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  updateProfile: async (userId: string, payload: UpdateProfilePayload): Promise<User> => {
    const user = await usersDb.update(userId, payload);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },
};
