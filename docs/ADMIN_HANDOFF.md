# Admin handoff — application data

All submissions are written by the server (service-role key) through the `submit_application(p jsonb)` RPC in
`supabase/migrations/001_init.sql`, so each application is saved atomically.

| Table | What it holds |
|---|---|
| `jobs` | Openings shown on /careers. Set `is_open = false` to hide one. `rank_code` pre-selects the position on the form. |
| `applications` | One row per applicant: personal particulars, `nrc` (e.g. `10/MaLaMa(N)133870`), `photo_path`, `ref_no` (`JENA-2026-000001`). |
| `application_schools` | Marine college / school rows (1–3 per applicant). |
| `application_certificates` | `kind = 'main'` (coc, gmdss, other, passport, sid, cdc) or `'stcw'` (ticked certificates). `capacity` is only used for C.O.C. |
| `application_sea_service` | Up to 5 vessels; `position_order = 1` is the most recent. `grt`/`power` are numbers, `power_unit` is BHP or KW. |
| `contact_messages` | Contact-page messages; `inquiry_type` is seafarer / training / shipowner / other. |

Office-use columns on `applications` for the dashboard: `status` (new, reviewing, interview, approved, rejected, on_board),
`interview_result`, `recommended_to`, `decision_date` — these are the "Result of interview / Recommended to / Date"
boxes on the paper form.

Files live in the private Storage bucket `applications`: `{application_id}/photo.jpg` and `contact/{id}/{file}`.
Use signed URLs (`storage.from('applications').createSignedUrl(path, 3600)`) to display them.

RLS is on for every table; only `jobs` (where `is_open`) is publicly readable. The admin app should authenticate staff
and use policies or the service role server-side.
