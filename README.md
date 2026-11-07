# Jena Shipping website

Next.js 15 (static export) · Tailwind v4 · GSAP/Lenis · react-hook-form + zod · Google Sheets for form submissions.

```bash
npm install
npm run dev
```

## Forms → Google Sheets
Job applications and contact messages are saved to a Google Sheet by a Google Apps Script web app
(`google-apps-script/Code.gs`). It also stores photos/attachments in Google Drive and emails the office.
Setup: [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md). The web-app URL goes in `formsEndpoint` in `lib/site.ts`;
while it's empty the forms run in demo mode (they validate but send nothing).

The older Supabase design (`supabase/`, `app/actions/`, `docs/ADMIN_HANDOFF.md`) is not used by the live site.

## Hosting
The live site, **jenashipping.com**, is a static export served by the Cloudflare Worker **jennashippingupdated** (Workers static assets), connected to this GitHub repo. Every push to `main` rebuilds and deploys it.
- Build command: `npm run build` (writes `out/`) · Deploy command: `npx wrangler deploy` · Node version: `.node-version` (22)
- `wrangler.jsonc` tells wrangler to publish `out/` as static files. Without it, wrangler tries to turn the site into a server app (OpenNext) and the deploy fails.
- Don't set `NEXT_PUBLIC_BASE_PATH` on Cloudflare; the site is served from the domain root.
- The public address used for canonical URLs, share previews and the sitemap is `url` in `lib/site.ts`.
- DNS: keep the MX (Namecheap email forwarding) and TXT (SPF, Google verification) records when changing the website records.

## Where things are
- Application form: `components/form/*`; validation rules: `lib/application-schema.ts`; dropdown lists & certificate list: `lib/form-options.ts`
- Server actions: `app/actions/submit-application.ts`, `app/actions/submit-contact.ts`
- Contact details / address / messaging links: `lib/site.ts`
- Admin data model for the dashboard: `docs/ADMIN_HANDOFF.md`
