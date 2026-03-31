import { supabase } from "./supabase";
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse,
} from "@neuropath/types";
import { UnauthorizedError, ConflictError } from "../../utils/errors";

export const authApi = {
  /* Create a new account */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { name, email, password } = payload;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        throw new ConflictError("An account with this email already exists");
      }
      throw new Error(error.message);
    }

    if (!data.user) throw new Error("Signup failed — no user returned");

    // Email confirmation is ON — no session yet
    // Tell the UI to show "check your email" screen
    if (!data.session) {
      throw new Error("CHECK_EMAIL"); // catch this in your UI and show confirmation message
    }

    /* Persist the extended profile (name, grade_level, etc.) */
    const { error: profileError } = await supabase
      .from("users")
      .insert({ id: data.user.id, name, email });

    if (profileError) throw new Error(profileError.message);

    const { data: profile, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (fetchError || !profile) throw new Error("Could not load user profile");

    return {
      user: profile,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at:
          data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        user_id: data.user.id,
      },
    };
  },

  /* Log in with email and password */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { email, password } = payload;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      throw new UnauthorizedError("Account not found");
    }

    return {
      user: profile,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at:
          data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        user_id: data.user.id,
      },
    };
  },

  /* Invalidate the current session */
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};
