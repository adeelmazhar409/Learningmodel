/*
  What this file does:
  --------------------
  Instead of using console.log() everywhere (which gives you no
  context about when something happened or how serious it is),
  we use a logger with levels.

  Levels (from least to most serious):
  - info  → Normal events (server started, request received)
  - warn  → Something unexpected but not broken (bad token, missing field)
  - error → Something broke (database error, AI call failed)
  - debug → Detailed info only shown in development

  Every log line includes a timestamp and the level so you can
  quickly scan logs and understand what happened and when.

  Usage anywhere in the server:
  ------------------------------
  import { logger } from "../utils/logger";

  logger.info("Server started on port 4000");
  logger.warn("Retrying OpenAI call — attempt 2");
  logger.error("Database query failed", { table: "users", error: err.message });
  logger.debug("Incoming request body", req.body);
*/

import { env } from "../config/env";

type LogLevel = "info" | "warn" | "error" | "debug";

/* ANSI colour codes for terminal output */
const COLOURS: Record<LogLevel, string> = {
  info:  "\x1b[36m",  // Cyan
  warn:  "\x1b[33m",  // Yellow
  error: "\x1b[31m",  // Red
  debug: "\x1b[35m",  // Magenta
};
const RESET = "\x1b[0m";

function formatTimestamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  /* In production suppress debug logs */
  if (level === "debug" && env.IS_PROD) return;

  const colour    = COLOURS[level];
  const timestamp = formatTimestamp();
  const prefix    = `${colour}[${timestamp}] [${level.toUpperCase()}]${RESET}`;

  if (meta !== undefined) {
    const metaStr = typeof meta === "object"
      ? JSON.stringify(meta, null, 2)
      : String(meta);
    console.log(`${prefix} ${message}\n${metaStr}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  info:  (message: string, meta?: unknown) => log("info",  message, meta),
  warn:  (message: string, meta?: unknown) => log("warn",  message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
};
