# StreamX Admin — Grade 3

A separate web app (React + Vite + Tailwind) that gives you full control
over StreamX: content (CMS), users, ads, and app-wide settings — with its
own login, completely isolated from the Flutter app.

## Design

- **Colours:** near-black base (`#0B0C10`), dark surface cards (`#14161C`),
  Signal Red accent (`#E5322D`) matching the app's brand, Broadcast Cyan
  (`#2DD4E8`) for data/analytics accents.
- **Type:** Space Grotesk for headings/stat numbers, Inter for UI text,
  JetBrains Mono for IDs/timestamps/emails.
- **Signature element:** a thin animated cyan→red "pulse bar" (a nod to a
  live broadcast signal) on the active sidebar item and stat cards.

## Pages

- `/login` — admin sign-in (the only entry point, no public sign-up)
- `/` — Dashboard: user/content totals, category chart, most-viewed, recent sign-ups
- `/content` — CMS table: search, filter by category, toggle Featured/Trending, delete
- `/content/new` and `/content/:id` — full create/edit form for any content type
- `/ads` — the "remote control": maintenance mode, force-update version, AdMob IDs, custom banner, Telegram link
- `/users` — search users, change their subscription tier, block/unblock

## How to run

1. `cd streamx-admin`
2. `npm install`
3. Copy `.env.example` → `.env` and set `VITE_API_URL` to your backend's `/api` URL
4. `npm run dev` → opens on `http://localhost:3001`
5. Sign in with the superadmin account you created via the backend's
   `scripts/createSuperAdmin.js`

## Deploying (Vercel)

1. Push `streamx-admin/` to its own GitHub repo (or a subfolder of your monorepo).
2. On Vercel: New Project → import the repo → framework preset **Vite**.
3. Add environment variable `VITE_API_URL` = your live backend URL + `/api`.
4. Deploy. Keep this URL private/unlisted — it's for admins only, it is
   never linked from the app or the public landing page.

## Note on RBAC

- `editor` role: can create/update content and edit ads/config.
- `moderator` role: can block/unblock users.
- `superadmin` role: can do everything, including deleting content/users
  and overriding subscription tiers.
