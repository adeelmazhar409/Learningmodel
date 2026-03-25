import "dotenv/config";
import express        from "express";
import cors           from "cors";
import helmet         from "helmet";
import { env }        from "./config/env";
import { router }     from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { logger }     from "./utils/logger";

const app = express();

/* ── Security headers ── */
app.use(helmet());

/* ── CORS — only allow requests from the frontend ── */
app.use(cors({
  origin:      env.FRONTEND_URL,
  credentials: true,
  methods:     ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* ── Body parsing ── */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ── Health check ── */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

/* ── All API routes ── */
app.use("/api", router);

/* ── Global error handler (must be last) ── */
app.use(errorMiddleware);

/* ── Start ── */
app.listen(env.PORT, () => {
  logger.info(`NeuroPath server running on port ${env.PORT} [${env.NODE_ENV}]`);
});

export default app;
