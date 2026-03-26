import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/*
  We use the SERVICE ROLE key here — not the anon key.

  The anon key is what the frontend uses. It respects Row Level
  Security (RLS) policies so users can only read their own data.

  The service role key bypasses RLS completely. This is safe on the
  backend because the server controls all access — we check auth
  manually in our middleware before touching the database.

  NEVER expose the service role key to the frontend.
*/
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken:  false,
      persistSession:    false,
      detectSessionInUrl:false,
    },
  }
);
