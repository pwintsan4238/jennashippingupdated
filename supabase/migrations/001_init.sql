-- Jena Shipping — initial schema
-- Run in Supabase SQL editor (or `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- jobs
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  rank_code text not null,
  department text not null check (department in ('Deck', 'Engine', 'Catering', 'Shore-based')),
  vessel_type text not null default '',
  location text not null default 'Myanmar',
  experience text not null default '',
  contract_duration text not null default '',
  sign_on_window text not null default '',
  requirements text[] not null default '{}',
  duties text[] not null default '{}',
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------- applications
create sequence if not exists public.application_ref_seq;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  ref_no text unique not null
    default 'JENA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.application_ref_seq')::text, 6, '0'),
  job_id uuid references public.jobs (id) on delete set null,
  position_applied text not null,
  english_name text not null,
  chinese_name text,
  dob date not null,
  place_of_birth text not null,
  height_cm numeric(5, 1) not null,
  weight_kg numeric(5, 1) not null,
  blood_type text not null,
  next_of_kin text not null,
  relationship text not null,
  address text not null,
  boiler_suit text not null,
  shoe_size text not null,
  home_phone text,
  mobile text not null,
  email text not null,
  nrc text not null,
  no_sea_service boolean not null default false,
  photo_path text,
  -- office use (filled from the admin dashboard)
  status text not null default 'new' check (status in ('new', 'reviewing', 'interview', 'approved', 'rejected', 'on_board')),
  interview_result text,
  recommended_to text,
  decision_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.application_schools (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.applications (id) on delete cascade,
  name text not null,
  speciality text not null,
  graduation_year int not null,
  diploma text not null
);

create table if not exists public.application_certificates (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.applications (id) on delete cascade,
  kind text not null check (kind in ('main', 'stcw')),
  code text not null,
  label text not null,
  capacity text,
  number text not null,
  issue_date date,
  expiry_date date,
  authority text not null
);

create table if not exists public.application_sea_service (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.applications (id) on delete cascade,
  position_order int not null, -- 1 = most recent
  company text not null,
  vessel text not null,
  vessel_type text not null,
  flag text not null,
  grt numeric,
  power numeric,
  power_unit text check (power_unit in ('BHP', 'KW')),
  trading_area text not null,
  rank text not null,
  sign_on date not null,
  sign_off date,
  remarks text
);

create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_position_idx on public.applications (position_applied);
create index if not exists application_certs_app_idx on public.application_certificates (application_id);
create index if not exists application_sea_app_idx on public.application_sea_service (application_id);
create index if not exists application_schools_app_idx on public.application_schools (application_id);

-- ------------------------------------------------------ contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  inquiry_type text not null,
  message text not null,
  attachment_path text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ RLS
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.application_schools enable row level security;
alter table public.application_certificates enable row level security;
alter table public.application_sea_service enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read open jobs" on public.jobs;
create policy "Public can read open jobs" on public.jobs for select using (is_open);
-- No anon policies on application/contact tables: only the service role (server) writes.

-- ------------------------------------------------- atomic submission RPC
-- Called by the Next.js server action with the service-role key.
create or replace function public.submit_application(p jsonb)
returns table (application_id uuid, reference text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid := (p ->> 'id')::uuid;
  v_ref text;
  v_job uuid;
begin
  select j.id into v_job from jobs j where j.slug = nullif(p ->> 'job_slug', '');

  insert into applications (
    id, job_id, position_applied, english_name, chinese_name, dob, place_of_birth,
    height_cm, weight_kg, blood_type, next_of_kin, relationship, address, boiler_suit,
    shoe_size, home_phone, mobile, email, nrc, no_sea_service, photo_path
  ) values (
    v_id, v_job, p ->> 'position_applied', p ->> 'english_name', nullif(p ->> 'chinese_name', ''),
    (p ->> 'dob')::date, p ->> 'place_of_birth', (p ->> 'height_cm')::numeric, (p ->> 'weight_kg')::numeric,
    p ->> 'blood_type', p ->> 'next_of_kin', p ->> 'relationship', p ->> 'address', p ->> 'boiler_suit',
    p ->> 'shoe_size', nullif(p ->> 'home_phone', ''), p ->> 'mobile', p ->> 'email', p ->> 'nrc',
    coalesce((p ->> 'no_sea_service')::boolean, false), p ->> 'photo_path'
  ) returning applications.ref_no into v_ref;

  insert into application_schools (application_id, name, speciality, graduation_year, diploma)
  select v_id, s ->> 'name', s ->> 'speciality', (s ->> 'graduation_year')::int, s ->> 'diploma'
  from jsonb_array_elements(coalesce(p -> 'schools', '[]')) s;

  insert into application_certificates (application_id, kind, code, label, capacity, number, issue_date, expiry_date, authority)
  select v_id, c ->> 'kind', c ->> 'code', c ->> 'label', nullif(c ->> 'capacity', ''), c ->> 'number',
         nullif(c ->> 'issue_date', '')::date, nullif(c ->> 'expiry_date', '')::date, c ->> 'authority'
  from jsonb_array_elements(coalesce(p -> 'certificates', '[]')) c;

  insert into application_sea_service (
    application_id, position_order, company, vessel, vessel_type, flag, grt, power, power_unit,
    trading_area, rank, sign_on, sign_off, remarks
  )
  select v_id, (s ->> 'position_order')::int, s ->> 'company', s ->> 'vessel', s ->> 'vessel_type', s ->> 'flag',
         nullif(s ->> 'grt', '')::numeric, nullif(s ->> 'power', '')::numeric, s ->> 'power_unit',
         s ->> 'trading_area', s ->> 'rank', (s ->> 'sign_on')::date, nullif(s ->> 'sign_off', '')::date,
         nullif(s ->> 'remarks', '')
  from jsonb_array_elements(coalesce(p -> 'sea_service', '[]')) s;

  return query select v_id, v_ref;
end;
$$;

revoke all on function public.submit_application(jsonb) from public, anon, authenticated;

-- --------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('applications', 'applications', false)
on conflict (id) do nothing;

-- ----------------------------------------------------------------- seed
insert into public.jobs (slug, title, rank_code, department, vessel_type, location, experience,
                         contract_duration, sign_on_window, requirements, duties)
values (
  'chief-engineer', 'Chief Engineer', 'CE', 'Engine', 'General Cargo / Container', 'Myanmar', 'Mid',
  '6–9 months', 'As soon as possible',
  array[
    'Valid STCW III/2 Chief Engineer COC (Unlimited)',
    'Minimum 12 months sea service as Chief Engineer or 1/E',
    'Valid Passport, SID and Seaman Book (CDC)',
    'Basic Safety, AFF, PMFA and Security certificates'
  ],
  array[
    'Take overall charge of the engine department and its safe, efficient operation',
    'Lead, train and supervise engineers, oilers, fitters and wipers on board',
    'Plan and carry out the Planned Maintenance System (PMS) for main engine, auxiliaries and deck machinery',
    'Ensure compliance with SOLAS, MARPOL, ISM and flag-state requirements in the engine room',
    'Manage fuel, lube oil and spare-part inventories, bunkering and consumption reports',
    'Coordinate repairs, dry-docking and class surveys with the Master and technical superintendent',
    'Maintain engine log books, oil record book and all statutory engine-department records',
    'Lead engine-room emergency drills and keep fire-fighting and safety equipment ready',
    'Monitor performance and propose improvements to efficiency and emissions',
    'Evaluate engine crew performance and report to the company'
  ]
)
on conflict (slug) do nothing;
