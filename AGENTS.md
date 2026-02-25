# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**Archive 09 // Collective Memory** is a Next.js 14 App Router application with a Supabase backend (PostgreSQL + Auth + Storage). It renders an interactive canvas with draggable scraps (images, videos, text, links) and a public comment form. An admin panel at `/admin` allows managing canvas elements.

### Running the Application

- **Dev server:** `npm run dev` (runs on `localhost:3000`)
- **Build:** `npm run build`
- **Lint:** `npx eslint .` (the `eslint.config.js` uses Vite-style plugins, not `eslint-config-next`; do NOT use `next lint` as it prompts interactively)
- See `SETUP.md` for full Supabase setup instructions.

### Local Supabase Backend

The app depends entirely on Supabase. For local development, use the Supabase CLI via Docker:

1. Start Docker daemon: `sudo dockerd > /tmp/dockerd.log 2>&1 &` then `sudo chmod 666 /var/run/docker.sock`
2. Initialize (first time only): `npx supabase init`
3. Start: `npx supabase start` (pulls Docker images on first run; takes several minutes)
4. Get keys: `npx supabase status` — use "Publishable" as `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `http://127.0.0.1:54321` as `NEXT_PUBLIC_SUPABASE_URL`

### Database Schema

The migration file referenced in `SETUP.md` (`supabase/migrations/00001_init.sql`) does not exist in the repo. Tables must be created manually via `psql` on port 54322 (user: `postgres`, password: `postgres`):

- `canvas_elements` — id (UUID), type, content, transform (JSONB), style (JSONB), is_published, created_at, updated_at
- `comments` — id (UUID), body, status, created_at
- `site_state` — id (INT, always 1), admin_note, updated_at

All tables have RLS enabled. Public read policies exist for published elements, approved comments, and site state. Admin mutations are gated by `auth.jwt() ->> 'email'` matching `NEXT_PUBLIC_ADMIN_EMAIL`.

### Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key from supabase status>
NEXT_PUBLIC_ADMIN_EMAIL=admin@archive09.dev
```

### Test Admin Account

Create via Supabase signup API:
```bash
curl -X POST 'http://127.0.0.1:54321/auth/v1/signup' \
  -H "apikey: <publishable key>" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@archive09.dev", "password": "admin123456"}'
```

### Gotchas

- `npm install` requires `--legacy-peer-deps` due to ESLint 9 vs `eslint-config-next` (expects ESLint 7/8) peer conflict.
- The `eslint.config.js` references `globals`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` which are not in `package.json` — they must be installed as devDependencies.
- No test framework is configured; there are no automated tests.
- The `supabase/` directory is created by `npx supabase init` and contains config only — it is not part of the original repo.
- A `media` storage bucket must be created in Supabase for image/video uploads.
