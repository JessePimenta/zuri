# Setup Guide: Archive 09 with Supabase

Step-by-step instructions for creating the Supabase project, configuring auth, and deploying to Vercel.

---

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose your organization, enter a **Project name** (e.g. `archive-09`), set a **Database password** (save it), and pick a region.
4. Click **Create new project** and wait for it to finish.

---

## 2. Create Public Storage Bucket

1. In the Supabase dashboard, go to **Storage**.
2. Click **New bucket**.
3. Name it **`media`**.
4. Enable **Public bucket** (so files have public URLs).
5. Click **Create bucket**.

---

## 3. Run SQL Migrations

1. Go to **SQL Editor** in the Supabase dashboard.
2. Open `supabase/migrations/00001_init.sql` from this repo.
3. **Replace every `&lt;MY_EMAIL_PLACEHOLDER&gt;`** with your admin email (the one you will use to log in).
4. Copy the full SQL and paste it into the editor.
5. Click **Run**.

This creates:

- `canvas_elements` – draggable scraps (images, videos, text, links)
- `comments` – public testimonials (auto-approved)
- `site_state` – admin note shown on homepage
- RLS policies (public read for published content, admin-only mutations)
- Storage policy for admin uploads to `media`

---

## 4. Create Admin User

1. Go to **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter the same **email** you used in the SQL (and a **password**).
4. Click **Create user**.

You will use this email and password to log in at `/admin/login`.

---

## 5. Set Environment Variables

1. In Supabase, go to **Project Settings** → **API**.
2. Copy:
   - **Project URL**
   - **anon public** key (under Project API keys)

3. In your project root, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
```

Replace:

- `NEXT_PUBLIC_SUPABASE_URL` with your Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key
- `NEXT_PUBLIC_ADMIN_EMAIL` with the same admin email you used in the SQL (must match exactly)

---

## 6. Run Locally

```bash
npm install
npm run dev
```

- Homepage: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (log in with your admin user)

---

## 7. Deploy to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Add the same env vars under **Settings** → **Environment Variables**:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`

4. Deploy.

---

## Notes

- **RLS and admin email:** The SQL policies only allow mutations when `auth.jwt() ->> 'email'` matches your admin email. If you change admins, run new SQL to replace the email in the policies.
- **Storage:** Uploaded images/videos are stored in the `media` bucket and referenced in `canvas_elements` via public URLs.
- **Comments:** New comments are inserted with `status = 'approved'` and appear in the rotating testimonial bar on the homepage.
