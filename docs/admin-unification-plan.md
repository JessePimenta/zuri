# Admin unification plan

**Goal:** One site, two states (public / admin). No duplicate canvas. Admin only via login at `/admin`. Optional “View as visitor” toggle in admin.

---

## Plan summary

1. **Single canvas** – The main site’s canvas is the only canvas. It accepts `isAdmin` and (when admin) shows edit controls; when not admin it’s the public view.
2. **`/admin` as login gate** – Not logged in → show login form only. Logged in (Supabase, email + password) → show admin panel (sidebar + canvas in admin mode).
3. **Auth** – Supabase Auth. User enters email + password at `/admin`. 1–2 allowed admin users (e.g. env list). Long-lived session. No “knowing who they are” before they log in.
4. **View as visitor toggle** – Inside admin panel, one boolean. When ON: hide sidebar, pass `isAdmin={false}`, show only published elements; show “Exit preview” to turn off.

---

## Checklist

### 1. Auth and `/admin` route

- [x] Ensure `/admin` shows **login form only** when no valid session (no admin panel, no canvas).
- [x] Login form: email + password → Supabase `signInWithPassword` (or equivalent).
- [x] After successful login, set session (Supabase handles this); redirect or render admin panel.
- [x] Admin panel only rendered when session exists and user is in allowed admin list (e.g. `NEXT_PUBLIC_ADMIN_EMAIL` or list of allowed emails in env).
- [x] Sign out clears session; optional “keep me logged in” / long-lived session via Supabase config.

### 2. Single canvas (unify public and admin)

- [x] Identify the single place the canvas is rendered (e.g. main page or shared `Canvas` component).
- [x] Public route (e.g. `/`): fetch **published** elements only; render canvas with `isAdmin={false}`. No sidebar.
- [x] Admin panel (after login): fetch **all** elements; render **same** canvas with `isAdmin={true}` and sidebar (add form, View site, Sign out).
- [x] Remove duplicate canvas implementation from current admin panel (reuse the same component the public site uses, with different props).

### 3. Data flow

- [x] One data source pattern: server or client fetches elements; “published only” vs “all” depends on context (public vs admin).
- [x] Admin panel gets “all elements” so Zuri can edit unpublished; public and “View as visitor” get “published only.”

### 4. View as visitor toggle

- [x] Add state: `previewAsVisitor` (boolean), default `false`.
- [x] Toggle or “View as visitor” button in admin chrome (e.g. sidebar header).
- [x] When `previewAsVisitor` is true: hide sidebar (or show minimal bar); render canvas with `isAdmin={false}`; pass only published elements (or filter in place).
- [x] “Exit preview” or toggle off returns to full admin view (sidebar + `isAdmin={true}`).

### 5. Cleanup and polish

- [x] Remove any obsolete admin-only route or duplicate canvas code.
- [x] Ensure “View site” (or equivalent) from admin opens public site in new tab (e.g. `/`).
- [x] Verify unauthenticated users never see admin UI; `/admin` shows only login until they log in.

---

## Order of implementation (suggested)

1. Auth and `/admin` login gate (so only logged-in admin sees panel).
2. Unify canvas (one component, `isAdmin` + sidebar only when admin).
3. Wire admin panel to use that canvas and “all elements.”
4. Add “View as visitor” toggle and published-only preview.
5. Cleanup and tests.
