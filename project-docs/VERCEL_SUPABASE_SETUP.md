# Vercel + Supabase Setup

## 1. Repository layout

- Keep the raw source library in the workspace root, but do not commit it to the deploy repo.
- Deploy the app from `apps/web`.
- Keep Supabase migrations under `supabase/migrations`.
- Use the included `.gitignore` and `.vercelignore` so Vercel does not receive local raw-source clutter.

## 2. Local prep

1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `APP_BASE_URL`

## 3. Supabase

1. Create a new Supabase project.
2. Run both migrations in order:
   - `supabase/migrations/20260410_initial.sql`
   - `supabase/migrations/20260410_hosted_upgrade.sql`
3. Enable magic-link email auth.
4. Add redirect URLs:
   - `http://localhost:3000`
   - your production Vercel URL
5. Confirm these storage buckets exist:
   - `lesson-media`
   - `source-library`
   - `generated-assets`
6. Publish the approved course content:

```bash
npm run publish:content
```

7. Verify the hosted project:

```bash
npm run verify:hosted
```

## 4. Vercel

1. Create a private GitHub repo for the deployable project.
2. Push the workspace.
3. Import the repo into Vercel.
4. Set the root directory to `apps/web`.
5. Vercel will read `apps/web/vercel.json`.
6. Add the same environment variables from `apps/web/.env.local` into the Vercel project.
7. Use `main` as production and preview deployments for feature branches.

## 5. Runtime expectation

- The app still works locally without hosted config.
- Once env vars are present, magic-link auth, hosted progress sync, and remote attempt persistence are enabled.
- The approved course content can be published into Supabase with `npm run publish:content`.
- `npm run verify:hosted` checks tables, anon content reads, storage buckets, and basic publishing state.
