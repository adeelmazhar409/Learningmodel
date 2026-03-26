import { supabase } from "../config/supabase";
import type { User } from "@neuropath/types";

export const usersDb = {

  findById: async (id: string): Promise<User | null> => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    return data as User | null;
  },

  create: async (payload: { id: string; name: string; email: string }): Promise<User> => {
    const { data, error } = await supabase
      .from("users")
      .insert({
        id:               payload.id,
        name:             payload.name,
        email:            payload.email,
        grade_level:      null,
        learning_profile: null,
        created_at:       new Date().toISOString(),
        updated_at:       new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  },

  update: async (id: string, payload: Partial<User>): Promise<User | null> => {
    const { data } = await supabase
      .from("users")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return data as User | null;
  },
};
