# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NeuroPath is a personalized learning platform that diagnoses how students retain information through a diagnostic assessment, then generates AI-powered study materials from lecture recordings tailored to each student's learning profile.

## Repository Structure

Monorepo with three packages:

- **apps/web** — Next.js 15 (React 19) frontend, App Router
- **apps/server** — Express.js backend with Supabase, OpenAI, AssemblyAI
- **packages/types** — Shared TypeScript type definitions

## Commands

### Frontend (apps/web)
```bash
cd apps/web
npm install
npm run dev          # starts on port 3000
npm run build
npm run lint
```

### Backend (apps/server)
```bash
cd apps/server
npm install
npm run dev          # ts-node-dev, starts on port 4000
npm run build        # compiles to dist/
npm start            # runs compiled dist/index.js
```

No root-level package manager orchestration — run commands from each app directory.

## Architecture

### Frontend

**Routing:** Next.js App Router with two route groups:
- `(auth)/` — login, signup (no app shell)
- `(app)/` — protected pages (dashboard, diagnostic, record, study-packs, roadmap) wrapped in auth guard + Nav

**State:** Zustand stores with localStorage persistence (`neuropath-auth` key):
- `auth.store` — user profile + session tokens
- `diagnostic.store` — quiz state machine (idle → rounds → break → recall → complete)
- `recording.store` — audio capture lifecycle (idle → recording → uploading → processing → ready)

**API layer:** `src/lib/api/client.ts` provides an Axios instance with auth token injection and a `callOrMock()` helper. Each domain has a dedicated `*.api.ts` file exporting mock + real implementations.

**Mock mode:** When `NEXT_PUBLIC_API_URL` is unset, the frontend runs entirely offline with hardcoded mock data. The `(app)/layout.tsx` auto-creates a mock session so auth guards never fire.

### Backend

**Middleware stack:** helmet → cors → json parsing → route-level Zod validation → auth middleware → controller → global error handler.

**Auth:** JWT validated via Supabase `auth.getUser()`. Backend uses the Supabase service role key (bypasses RLS) with manual auth checks. 401 responses trigger frontend auto-logout.

**AI pipeline:** Lecture audio → AssemblyAI async transcription (webhook callback) → OpenAI gpt-4o generates personalized study packs (flashcards, quizzes, teach-back scripts) weighted by the student's learning profile.

**Error classes:** `src/utils/errors.ts` — `AppError` base with subclasses for each HTTP status (ValidationError 400, UnauthorizedError 401, NotFoundError 404, etc.).

### Shared Types

`packages/types/src/` — domain type files (user, diagnostic, recording, roadmap) imported by both apps.

## Environment Variables

### Backend (required)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`, `ASSEMBLYAI_API_KEY`
- `JWT_SECRET` (min 32 chars)

### Backend (optional)
- `PORT` (default 4000), `NODE_ENV`, `REDIS_URL` (default localhost:6379), `FRONTEND_URL` (default http://localhost:3000)

### Frontend
- `NEXT_PUBLIC_API_URL` — backend URL; if unset, frontend runs in mock mode
- `NEXT_PUBLIC_APP_URL` — used for metadata base URL (default http://localhost:3001)

## Design System

Tailwind config extends with custom tokens:
- Colors: `ink` (#0c0c0e), `surface` (#141418), `flame` (#d94f2b), `ember` (#e8603c), `chalk` (#f0ede8)
- Fonts: Playfair Display (serif headings), DM Sans (sans body)
- CSS variables defined in `globals.css` mirror these tokens

## Key Patterns

- API files use `callOrMock()` for dual real/mock paths — maintain both when editing API layer
- Zod schemas validate all server inputs; env config validated at startup (exits on failure)
- File uploads use in-memory Multer (100MB limit), no disk writes
- BullMQ + Redis for background job processing
- Landing page uses inline CSS (self-contained), app pages use Tailwind + CSS variables
