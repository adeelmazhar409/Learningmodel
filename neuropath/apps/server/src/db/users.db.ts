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

  create: async (payload: {
    id: string;
    name: string;
    email: string;
  }): Promise<User> => {
    console.log("🔵 usersDb.create called with payload:", payload);
    console.log(
      "🔵 Payload.name type:",
      typeof payload.name,
      "Value:",
      payload.name,
    );
    console.log("🔵 Payload.name is undefined?", payload.name === undefined);
    console.log("🔵 Payload.name is null?", payload.name === null);

    const { data, error } = await supabase
      .from("users")
      .insert({
        id: payload.id,
        name: payload.name,
        email: payload.email,
      })
      .select()
      .single();

    console.log("🔵 Supabase insert response:", {
      data,
      error: error ? error.message : null,
      errorDetails: error,
    });

    if (error) {
      console.error("❌ Database insert error:", error);
      throw new Error(error.message);
    }

    console.log("✅ User created in database:", data);
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
