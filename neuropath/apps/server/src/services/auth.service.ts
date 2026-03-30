import { supabase } from "../config/supabase";
import { usersDb } from "../db/users.db";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse,
} from "@neuropath/types";

export const authService = {
  /* Create a new account */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    console.log("📥 Signup payload received:", {
      name: payload.name,
      email: payload.email,
      password: "***",
    });

    const { name, email, password } = payload;

    console.log("📥 After destructuring:", { name, email, password: "***" });

    /* Check if user already exists in auth */
    const { data: existingAuthUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.users.find(
      (u) => u.email === email,
    );

    if (existingAuthUser) {
      console.log("⚠️ Auth user already exists:", existingAuthUser.id);
      // Check if they also exist in our users table
      const existingUser = await usersDb.findById(existingAuthUser.id);
      if (existingUser) {
        console.log("⚠️ User profile also exists");
        throw new ConflictError("An account with this email already exists");
      }
      console.log("ℹ️ Auth user exists but no profile - will create profile");
    }

    /* Create auth user in Supabase */
   const { data, error } = await supabase.auth.admin.createUser({
     email,
     password,
     email_confirm: true,
     user_metadata: { name }, // ← Add this line
   });

    if (error) {
      console.error("❌ Auth user creation failed:", error);
      if (error.message.includes("already registered")) {
        throw new ConflictError("An account with this email already exists");
      }
      throw new Error(error.message);
    }

    const authUser = data.user;
    console.log("✅ Auth user created/retrieved:", authUser.id);

    /* Check if user profile already exists (edge case: auth exists but profile doesn't) */
    let user = await usersDb.findById(authUser.id);

    if (!user) {
      console.log("👤 Creating user profile with:", {
        id: authUser.id,
        name,
        email,
      });

      /* Create user profile row in our users table */
      user = await usersDb.create({
        id: authUser.id,
        name,
        email,
      });

      console.log("✅ User profile created:", user);
    } else {
      console.log("ℹ️ User profile already exists:", user);
    }

    /* Sign in to get a session token */
    const { data: sessionData, error: sessionError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (sessionError || !sessionData.session) {
      console.error("❌ Session creation failed:", sessionError);
      throw new Error("Could not create session");
    }

    const session = {
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      expires_at:
        sessionData.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      user_id: user.id,
    };

    console.log("✅ Signup complete for user:", user.id);

    return { user, session };
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

    /* Fetch our extended user profile */
    const user = await usersDb.findById(data.user.id);
    if (!user) throw new UnauthorizedError("Account not found");

    const session = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at:
        data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      user_id: user.id,
    };

    return { user, session };
  },

  /* Invalidate the current session */
  logout: async (_userId: string): Promise<void> => {
    /* Supabase handles token invalidation server-side */
    await supabase.auth.signOut();
  },
};
