# NeuroPath — Tailwind CSS Migration & Dependency Update

## What Changed

### 1. Dependencies Updated (`package.json`)

| Package | Old Version | New Version |
|---------|------------|-------------|
| `next` | `^15.2.4` | `^15.5.14` |
| `react` | `^19.0.0` | `^19.1.0` |
| `react-dom` | `^19.0.0` | `^19.1.0` |
| `axios` | `^1.7.9` | `^1.13.6` |
| `@supabase/supabase-js` | `^2.47.10` | `^2.49.4` |
| `framer-motion` | `^12.4.7` | `^12.9.4` |
| `react-hot-toast` | `^2.4.1` | `^2.5.2` |
| `tailwindcss` | `^3.4.17` | `^3.4.19` |
| `autoprefixer` | `^10.4.20` | `^10.4.21` |
| `postcss` | `^8.5.1` | `^8.5.8` |
| `typescript` | `^5.7.3` | `^5.8.3` |
| `eslint` | `^9.17.0` | `^9.25.0` |
| `eslint-config-next` | `^15.2.4` | `^15.5.14` |
| `@types/node` | `^22.10.5` | `^22.15.3` |
| `@types/react` | `^19.0.7` | `^19.1.2` |
| `@types/react-dom` | `^19.0.3` | `^19.1.2` |

> **Note:** We stayed on Tailwind v3.x (not v4) because v4 is a complete rewrite
> with breaking changes (CSS-first config, no `tailwind.config.ts`, no `@tailwind`
> directives). Upgrading to v4 would require a full architecture change.
> Similarly, Next.js 16 is a major version — we updated to the latest 15.x stable.

### 2. PostCSS Config Added (`postcss.config.js`)

This file was **missing** from the project. Without it, Tailwind's PostCSS plugin
cannot process your CSS. This is now properly configured.

### 3. Tailwind Config Enhanced (`tailwind.config.ts`)

The config now includes:
- **All design tokens** as proper Tailwind theme values (colors, fonts, shadows, etc.)
- **Custom component classes** via `@layer components` plugin: `.card`, `.btn-primary`,
  `.btn-outline`, `.btn-danger`, `.eyebrow`, `.input`, `.skeleton`
- **Custom utility** `.grain` for the film grain overlay
- **Base styles** for reset, body, selection via `addBase()`
- **All animations** from the original CSS (riseIn, fadeIn, floatY, scrollX, barFloat, pulseDot)

### 4. All Vanilla CSS Converted to Tailwind

Every `<style>{...}</style>` block has been removed from components.
All styling now uses Tailwind utility classes or the component classes defined
in `tailwind.config.ts`.

**Files converted:**
- `src/components/landing/LandingPage.tsx` — ~250 lines of CSS removed
- `src/components/layout/Nav.tsx` — ~120 lines of CSS removed
- `src/components/layout/Drawer.tsx` — ~80 lines of CSS removed
- `src/components/recording/AudioRecorder.tsx` — ~100 lines of CSS removed
- `src/components/recording/ProcessingStatus.tsx` — ~100 lines of CSS removed
- `src/app/(app)/dashboard/page.tsx` — ~200 lines of CSS removed
- `src/app/(app)/record/page.tsx` — converted to Tailwind
- `src/app/(auth)/layout.tsx` — ~80 lines of CSS removed
- `src/app/(auth)/login/page.tsx` — ~60 lines of CSS removed
- `src/app/(auth)/signup/page.tsx` — ~60 lines of CSS removed

### 5. `globals.css` Slimmed Down

**Before:** ~300+ lines of vanilla CSS (reset, design tokens, typography helpers,
card styles, button styles, animations, responsive utilities, etc.)

**After:** 28 lines — just Tailwind directives, Google Fonts import, shimmer keyframe,
and scrollbar styling. Everything else is handled by Tailwind config.

### 6. Duplicate `src/src/` Structure Resolved

The project had files in both `src/` (vanilla CSS versions) and `src/src/`
(partial Tailwind conversions). This migration uses the canonical `src/` path
with everything fully converted to Tailwind.

## How to Apply

1. Replace these files in your repo:
   - `package.json`
   - `postcss.config.js` (NEW)
   - `tailwind.config.ts`
   - `tsconfig.json`
   - `next.config.js`
   - `src/app/globals.css`
   - All `.tsx` files listed above

2. Delete the `src/src/` directory entirely (it's the duplicate)

3. Delete `node_modules/` and `package-lock.json`, then reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

## Design Token Reference

| Tailwind Class | CSS Value | Usage |
|---------------|-----------|-------|
| `bg-ink` | `#0c0c0e` | Main background |
| `bg-ink-2` | `#111114` | Alt dark background |
| `bg-surface` | `#141418` | Card/panel backgrounds |
| `bg-lift` | `#1c1c22` | Elevated surfaces |
| `border-edge` | `rgba(255,255,255,0.07)` | Subtle borders |
| `border-edge-2` | `rgba(255,255,255,0.13)` | Visible borders |
| `text-flame` / `bg-flame` | `#d94f2b` | Primary accent |
| `text-ember` / `bg-ember` | `#e8603c` | Secondary accent |
| `text-text` | `#f0ede8` | Primary text |
| `text-soft` | `rgba(240,237,232,0.55)` | Secondary text |
| `text-whisper` | `rgba(240,237,232,0.25)` | Tertiary/muted text |
| `font-serif` | Playfair Display | Headings |
| `font-sans` | DM Sans | Body text |
| `rounded-pill` | `100px` | Pill/capsule shapes |
| `shadow-btn` | `0 4px 22px rgba(0,0,0,0.3)` | Button shadow |
| `shadow-nav` | `0 8px 40px rgba(0,0,0,0.55)` | Nav shadow |
| `shadow-orb` | Special compound | Brand orb shadow |
