-- Add missing columns to citations table
alter table if exists citations
  add column if not exists county text,
  add column if not exists preferred_contact text default 'email',
  add column if not exists citation_date date,
  add column if not exists upload_path text,
  add column if not exists ambassador_id text,
  add column if not exists referral_source text;

-- Run remaining table creates (idempotent, using gen_random_uuid)
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists ambassadors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  referral_code text not null unique,
  card_activated boolean default false,
  master_code_validated boolean default false,
  nda_signed boolean default false,
  agreement_executed boolean default false,
  w9_submitted boolean default false,
  banking_verified boolean default false,
  treasury_approved boolean default false,
  founder_approved boolean default false,
  active boolean default false,
  referral_count integer default 0,
  compensation_frozen boolean default false,
  link_disabled boolean default false,
  created_at timestamptz default now()
);

create table if not exists treasury_profiles (
  id uuid primary key default gen_random_uuid(),
  entity_name text not null,
  nda_signed boolean default false,
  agreement_executed boolean default false,
  w9_submitted boolean default false,
  banking_method text default 'zelle',
  banking_verified boolean default false,
  founder_authorized boolean default false,
  card_activated boolean default false,
  master_code_validated boolean default false,
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  resource text,
  details text,
  severity text default 'info',
  timestamp timestamptz default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  description text,
  resolved boolean default false,
  timestamp timestamptz default now()
);

create table if not exists deployment_settings (
  id uuid primary key default gen_random_uuid(),
  city text default 'Houston',
  engineer text default 'Jason Manuel',
  founder text default 'Marc Bouvier',
  company text default 'LAGNAF\u2122 network LLC',
  red_vault_active boolean default true,
  founder_dashboard_active boolean default true,
  countdown_engine_active boolean default true,
  citation_intake_active boolean default true,
  ambassador_system_active boolean default true,
  treasury_system_active boolean default true,
  banking_verification_active boolean default true,
  emergency_shutdown_active boolean default true,
  audit_monitoring_active boolean default true,
  qa_score integer default 0,
  live_status text default 'staging',
  founder_approval_granted boolean default false,
  global_shutdown boolean default false,
  updated_at timestamptz default now()
);

create table if not exists qa_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  item text not null,
  weight integer default 1,
  passed boolean default false,
  notes text,
  created_at timestamptz default now()
);
