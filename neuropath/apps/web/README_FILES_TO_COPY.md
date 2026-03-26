# Files to copy from your original repo

The following files have NO CSS changes and should be copied from your
original `neuropath/apps/web/src/` directory (NOT from `src/src/`):

- `src/lib/api/study-packs.api.ts` (large mock data, no CSS)
- `src/lib/api/roadmap.api.ts` (large mock data, no CSS)  
- `src/lib/api/diagnostic.api.ts` (large mock data, no CSS)
- `src/app/(app)/study-packs/[packId]/page.tsx` (use the src/src version - already Tailwind)
- `src/components/study-pack/FlashcardViewer.tsx`
- `src/components/study-pack/QuizViewer.tsx`
- `src/components/study-pack/TeachBackViewer.tsx`
- `src/app/(app)/diagnostic/` (all files)
- `src/app/(app)/roadmap/` (all files)
- `src/app/(app)/onboarding/` (all files)
- Any other page/component files not listed

All files included in this zip have been fully converted from vanilla CSS
to Tailwind CSS. The rest of your files don't need CSS changes.

## IMPORTANT: Delete `src/src/` directory
The `src/src/` directory in your repo is a duplicate. Delete it entirely.
