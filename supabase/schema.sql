create schema if not exists miniapp;

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
grant insert on miniapp.diva_onboarding_submissions to anon;

create policy "Allow valid public Diva onboarding submissions"
  on miniapp.diva_onboarding_submissions
  for insert
  to anon
  with check (
    length(trim(employee_name)) > 0
    and position('@' in email) > 1
    and length(trim(phone)) > 0
    and length(trim(emergency_contact_name)) > 0
    and length(trim(emergency_contact_phone)) > 0
    and length(trim(role_applied_for)) > 0
    and length(trim(employment_type)) > 0
    and policies_acknowledged is true
    and jsonb_typeof(form_payload) = 'object'
  );
