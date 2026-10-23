-- AutoAppeal™ Supabase Schema
-- Run this in your Supabase SQL editor after creating the project

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Citations table
create table if not exists citations (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  preferred_contact text default 'email',
  citation_number text not null,
  citation_date date,
  response_deadline timestamptz,
  county text,
  court text,
  jurisdiction text,
  violation_type text,
  upload_path text,
  ambassador_id text,
  referral_source text,
  risk_level text default 'green',
  status text default 'pending',
  payment_status text default 'unpaid',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_citations_email on citations(email);
create index idx_citations_status on citations(status);
create index idx_citations_deadline on citations(response_deadline);

-- Contacts table
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Ambassadors table
create table if not exists ambassadors (
  id uuid primary key default uuid_generate_v4(),
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

-- Treasury profiles table
create table if not exists treasury_profiles (
  id uuid primary key default uuid_generate_v4(),
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

-- Audit logs table (Red Vault)
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor text not null,
  action text not null,
  resource text,
  details text,
  severity text default 'info',
  timestamp timestamptz default now()
);

create index idx_audit_logs_timestamp on audit_logs(timestamp desc);
create index idx_audit_logs_severity on audit_logs(severity);

-- Red Vault alerts table
create table if not exists alerts (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  description text,
  resolved boolean default false,
  timestamp timestamptz default now()
);

create index idx_alerts_resolved on alerts(resolved);
create index idx_alerts_type on alerts(type);

-- Deployment settings table
create table if not exists deployment_settings (
  id uuid primary key default uuid_generate_v4(),
  city text default 'Houston',
  engineer text default 'Jason Manuel',
  founder text default 'Marc Bouvier',
  company text default 'LAGNAF™ network LLC',
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

-- QA items table
create table if not exists qa_items (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  item text not null,
  weight integer default 1,
  passed boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table citations enable row level security;
alter table contacts enable row level security;
alter table ambassadors enable row level security;
alter table treasury_profiles enable row level security;
alter table audit_logs enable row level security;
alter table alerts enable row level security;
alter table deployment_settings enable row level security;
alter table qa_items enable row level security;

-- Safe baseline: customer access is enabled by the versioned security migration.
-- Never grant every signed-in customer administrative access.
do $$ declare t text; begin
  foreach t in array array['citations','contacts','ambassadors','treasury_profiles','audit_logs','alerts','deployment_settings','qa_items'] loop
    execute format('create policy admin_baseline on public.%I for all to authenticated using ((auth.jwt()->''app_metadata''->>''role'') = ''admin'') with check ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')',t);
  end loop;
end $$;
-- REQUIRED: apply supabase/migrations/*.sql in chronological order after this file.
