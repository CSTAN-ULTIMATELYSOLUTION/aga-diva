create schema if not exists miniapp;

alter role authenticator set pgrst.db_schemas = 'public,storage,graphql_public,miniapp';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';

create table if not exists miniapp.diva_onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references miniapp.sessions(id) on delete set null,
  created_at timestamptz not null default now(),
  employee_name text not null,
  preferred_name text,
  email text not null,
  phone text not null,
  date_of_birth date,
  address text,
  emergency_contact_name text not null,
  emergency_contact_phone text not null,
  role_applied_for text not null,
  employment_type text not null,
  start_date date,
  schedule_availability text,
  salon_experience text,
  certifications text,
  strengths text,
  growth_goals text,
  uniform_size text,
  payroll_name text,
  bank_name text,
  bank_account_last4 text,
  tax_id_last4 text,
  policies_acknowledged boolean not null default false,
  signature_data_url text,
  form_payload jsonb not null
);

alter table miniapp.diva_onboarding_submissions enable row level security;

grant usage on schema miniapp to anon;
grant usage on schema miniapp to authenticated;
grant insert on miniapp.diva_onboarding_submissions to anon;
grant insert on miniapp.diva_onboarding_submissions to authenticated;
grant select on miniapp.diva_onboarding_submissions to authenticated;

create policy "Allow public Diva onboarding submissions"
  on miniapp.diva_onboarding_submissions
  for insert
  to anon
  with check (
    policies_acknowledged is true
    and jsonb_typeof(form_payload) = 'object'
  );

create policy "Allow authenticated Diva onboarding submissions"
  on miniapp.diva_onboarding_submissions
  for insert
  to authenticated
  with check (
    policies_acknowledged is true
    and jsonb_typeof(form_payload) = 'object'
  );

create policy "Allow authenticated admins to read Diva onboarding submissions"
  on miniapp.diva_onboarding_submissions
  for select
  to authenticated
  using (true);
