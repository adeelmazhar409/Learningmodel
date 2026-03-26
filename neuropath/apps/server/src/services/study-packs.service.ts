import { studyPacksDb }   from "../db/study-packs.db";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import type { StudyPack, ListStudyPacksParams } from "@neuropath/types";

export const studyPacksService = {

  list: async (userId: string, params?: ListStudyPacksParams): Promise<StudyPack[]> => {
    return studyPacksDb.findByUserId(userId, params);
  },

  getById: async (userId: string, packId: string): Promise<StudyPack> => {
    const pack = await studyPacksDb.findById(packId);
    if (!pack)               throw new NotFoundError("Study pack not found");
    if (pack.user_id !== userId) throw new ForbiddenError();
    return pack;
  },
};
