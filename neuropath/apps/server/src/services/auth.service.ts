import { supabase }       from "../config/supabase";
import { usersDb }        from "../db/users.db";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import type { SignupPayload, LoginPayload, AuthResponse } from "@neuropath/types";

export const authService = {

  /* Create a new account */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { name, email, password } = payload;

    /* Create auth user in Supabase */
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification for now
    });

    if (error) {
      if (error.message.includes("already registered")) {
        throw new ConflictError("An account with this email already exists");
      }
      throw new Error(error.message);
    }

    const authUser = data.user;

    /* Create user profile row in our users table */
    const user = await usersDb.create({
      id:    authUser.id,
      name,
      email,
    });

    /* Sign in to get a session token */
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({ email, password });
    if (sessionError || !sessionData.session) throw new Error("Could not create session");

    const session = {
      access_token:  sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      expires_at:    sessionData.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      user_id:       user.id,
    };

    return { user, session };
  },

  /* Log in with email and password */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { email, password } = payload;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    /* Fetch our extended user profile */
    const user = await usersDb.findById(data.user.id);
    if (!user) throw new UnauthorizedError("Account not found");

    const session = {
      access_token:  data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at:    data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      user_id:       user.id,
    };

    return { user, session };
  },

  /* Invalidate the current session */
  logout: async (_userId: string): Promise<void> => {
    /* Supabase handles token invalidation server-side */
    await supabase.auth.signOut();
  },
};
