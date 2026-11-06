# Jena Shipping website

Next.js 15 · Tailwind v4 · GSAP/Lenis · react-hook-form + zod · Supabase.

```bash
npm install
cp .env.example .env.local   # add Supabase keys (optional for local dev)
npm run dev
```

Without Supabase keys the site runs in demo mode: forms validate fully, but submissions are only logged on the server.

## Supabase setup
1. Create a project, open SQL editor, run `supabase/migrations/001_init.sql` (tables, RPC, private `applications` bucket, Chief Engineer seed job).
2. Put the URL, anon key and service-role key in `.env.local` / your host's env vars.

## Where things are
- Application form: `components/form/*`; validation rules: `lib/application-schema.ts`; dropdown lists & certificate list: `lib/form-options.ts`
- Server actions: `app/actions/submit-application.ts`, `app/actions/submit-contact.ts`
- Contact details / address / messaging links: `lib/site.ts`
- Admin data model for the dashboard: `docs/ADMIN_HANDOFF.md`
