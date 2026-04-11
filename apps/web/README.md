# Private CLEP Humanities Web App

This is the hosted study app that pairs with the local source workspace.

## Stack

- `Next.js` App Router
- `Vercel` for hosting
- `Supabase` for auth, storage, sync, and future published-content persistence
- `IndexedDB` for offline preview-mode progress

## Local run

```bash
npm install
npm run dev
```

## Hosted setup workflow

1. Copy `.env.example` to `.env.local`.
2. Fill in the Supabase and OpenAI keys.
3. Run the Supabase SQL migrations.
4. Publish the approved course content:

```bash
npm run publish:content
```

5. Verify the hosted project:

```bash
npm run verify:hosted
```

## Hosted root

If you deploy the whole workspace as one repo, set the Vercel root directory to `apps/web`.

## Required environment variables

Copy `.env.example` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `APP_BASE_URL`

## Current implementation status

- Module 1 (`Classical`) is fully normalized into objective bundles.
- Module 2 (`Middle Ages`) is fully normalized into objective bundles.
- Modules 3-6 are visible shells.
- The app can run without Supabase in local preview mode.
- Auth, coach, and sync are scaffolded for hosted mode.
- Supabase publish and verify scripts are included for the hosted setup path.
