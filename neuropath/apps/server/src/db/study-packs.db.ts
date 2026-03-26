import { supabase } from "../config/supabase";
import type { StudyPack, ListStudyPacksParams } from "@neuropath/types";

export const studyPacksDb = {

  create: async (payload: Omit<StudyPack, "id" | "created_at" | "updated_at">): Promise<StudyPack> => {
    const { data, error } = await supabase
      .from("study_packs")
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as StudyPack;
  },

  findById: async (id: string): Promise<StudyPack | null> => {
    const { data } = await supabase
      .from("study_packs")
      .select("*")
      .eq("id", id)
      .single();
    return data as StudyPack | null;
  },

  findByUserId: async (
    userId: string,
    params?: ListStudyPacksParams,
  ): Promise<StudyPack[]> => {
    let query = supabase
      .from("study_packs")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "ready")
      .order("created_at", { ascending: false });

    if (params?.limit)  query = query.limit(params.limit);
    if (params?.offset) query = query.range(params.offset, params.offset + (params.limit ?? 10) - 1);

    const { data } = await query;
    return (data ?? []) as StudyPack[];
  },

  findByRecordingId: async (recordingId: string): Promise<StudyPack | null> => {
    const { data } = await supabase
      .from("study_packs")
      .select("*")
      .eq("recording_id", recordingId)
      .single();
    return data as StudyPack | null;
  },
};
