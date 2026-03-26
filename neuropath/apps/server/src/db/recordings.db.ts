import { supabase } from "../config/supabase";
import type { Recording, RecordingStatus } from "@neuropath/types";

export const recordingsDb = {

  create: async (payload: {
    user_id:  string;
    title:    string;
    file_url: string;
    status:   RecordingStatus;
  }): Promise<Recording> => {
    const { data, error } = await supabase
      .from("recordings")
      .insert({
        ...payload,
        duration_s:    null,
        transcript:    null,
        transcript_id: null,
        created_at:    new Date().toISOString(),
        updated_at:    new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Recording;
  },

  findById: async (id: string): Promise<Recording | null> => {
    const { data } = await supabase
      .from("recordings")
      .select("*")
      .eq("id", id)
      .single();
    return data as Recording | null;
  },

  findByUserId: async (userId: string): Promise<Recording[]> => {
    const { data } = await supabase
      .from("recordings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []) as Recording[];
  },

  findByTranscriptId: async (transcriptId: string): Promise<Recording | null> => {
    const { data } = await supabase
      .from("recordings")
      .select("*")
      .eq("transcript_id", transcriptId)
      .single();
    return data as Recording | null;
  },

  updateStatus: async (id: string, status: RecordingStatus): Promise<void> => {
    await supabase
      .from("recordings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
  },

  saveTranscriptId: async (id: string, transcriptId: string): Promise<void> => {
    await supabase
      .from("recordings")
      .update({ transcript_id: transcriptId, updated_at: new Date().toISOString() })
      .eq("id", id);
  },

  saveTranscript: async (id: string, transcript: string): Promise<void> => {
    await supabase
      .from("recordings")
      .update({
        transcript,
        status:     "generating",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  },
};
