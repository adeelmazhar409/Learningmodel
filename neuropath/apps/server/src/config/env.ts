import { z } from "zod";

/* ── Define the schema of required env vars ── */
const envSchema = z.object({
  PORT:                     z.string().default("4000"),
  NODE_ENV:                 z.enum(["development", "production", "test"]).default("development"),
  SUPABASE_URL:             z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY:z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  OPENAI_API_KEY:           z.string().min(1, "OPENAI_API_KEY is required"),
  ASSEMBLYAI_API_KEY:       z.string().min(1, "ASSEMBLYAI_API_KEY is required"),
  REDIS_URL:                z.string().default("redis://localhost:6379"),
  JWT_SECRET:               z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  FRONTEND_URL:             z.string().default("http://localhost:3000"),
});

/* ── Parse and validate — throws immediately if anything is wrong ── */
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌  Invalid environment variables:");
  result.error.issues.forEach(issue => {
    console.error(`   ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = {
  ...result.data,
  PORT:        parseInt(result.data.PORT, 10),
  IS_DEV:      result.data.NODE_ENV === "development",
  IS_PROD:     result.data.NODE_ENV === "production",
};
