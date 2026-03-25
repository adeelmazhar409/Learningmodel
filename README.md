# Learningmodel — Project Setup Guide

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- npm (comes with Node.js)

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Learningmodel.git
cd Learningmodel
```

---

## Step 2 — Install Dependencies

This is a monorepo. You need to install dependencies in multiple places.

### Install root dependencies (if any)
```bash
cd W:\Learningmodel
npm install
```

### Install the web app dependencies
```bash
cd neuropath\apps\web
npm install
```

### Install the server dependencies
```bash
cd neuropath\apps\server
npm install
```

> **Note:** Never commit `node_modules/` to GitHub. It is listed in `.gitignore` and must be installed fresh on every machine.

---

## Step 3 — Environment Variables

Create a `.env.local` file inside `neuropath\apps\web\`:

```bash
cd neuropath\apps\web
copy .env.example .env.local
```

Then open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# Add other required keys here
```

> Ask the project owner for the correct env values if you don't have them.

---

## Step 4 — Run the Development Server

### Run the Next.js web app
```bash
cd neuropath\apps\web
npm run dev
```

The app will be available at: **http://localhost:3000**

### Run the backend server (in a separate terminal)
```bash
cd neuropath\apps\server
npm run dev
```

---

## Step 5 — Build for Production

```bash
cd neuropath\apps\web
npm run build
npm run start
```

---

## Project Structure

```
Learningmodel/
  neuropath/
    apps/
      web/                  ← Next.js frontend
        src/
          app/              ← App Router pages
            (app)/          ← Protected routes
              dashboard/
              diagnostic/
              onboarding/
              record/
              roadmap/
              study-packs/
            (auth)/         ← Auth routes
          components/       ← Shared components
          lib/              ← Utility functions
          store/            ← State management
        .next/              ← Build output (auto-generated, do not commit)
        node_modules/       ← Dependencies (do not commit)
      server/               ← Backend server
    packages/               ← Shared packages
```

---

## Common Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm run start` |
| Lint code | `npm run lint` |

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### node_modules issues
```bash
# Delete and reinstall
rd /s /q node_modules
npm install
```

### Next.js cache issues
```bash
# Delete .next folder and rebuild
rd /s /q .next
npm run build
```

### Git issues after cloning
```bash
# If you see thousands of changed files, run:
git rm -r --cached .
git add .
git commit -m "fix: reset git tracking"
```

---

## Important Notes

- **Never push `node_modules/`** — it is ignored by `.gitignore`
- **Never push `.env.local`** — it contains secrets
- **Always run `npm install`** after pulling new changes in case new packages were added
- The `.next/` folder is auto-generated — never commit it
