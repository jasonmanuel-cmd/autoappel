-- Apply after the existing schema/migration, in a transaction. Back up first.
begin;
create or replace function public.is_admin() returns boolean language sql stable
set search_path = '' as $$ select coalesce(auth.jwt()->'app_metadata'->>'role' = 'admin', false) $$;

alter table public.citations
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists service_fee_status text not null default 'unpaid',
  add column if not exists promo_code text;
-- Only link historical email-based records to verified accounts. Unmatched records
-- remain admin-only; do not allow customers to claim arbitrary email addresses.
update public.citations c set user_id = u.id from auth.users u
where c.user_id is null and lower(c.email) = lower(u.email) and u.email_confirmed_at is not null;
create index if not exists citations_user_id_idx on public.citations(user_id);

-- Replace permissive legacy policies, including policies created outside this repo.
do $$ declare p record; t text; begin
  foreach t in array array['citations','contacts','ambassadors','treasury_profiles','audit_logs','alerts','deployment_settings','qa_items'] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
        execute format('drop policy %I on public.%I', p.policyname, t);
      end loop;
      execute format('create policy admin_access on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    end if;
  end loop;
end $$;
create policy citation_owner_read on public.citations for select to authenticated using (user_id = auth.uid());
-- Customer insertion/update is intentionally server-only. Customers cannot mark
-- themselves paid, reassign records or change case status directly.

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(), citation_id uuid not null references public.citations(id),
  customer_email text not null, submission_type text not null, reason text, details text,
  status text not null default 'pending', created_at timestamptz not null default now()
);
alter table public.submissions enable row level security;
do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='submissions' loop
    execute format('drop policy %I on public.submissions', p.policyname);
  end loop;
end $$;
create policy submissions_admin on public.submissions for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy submissions_owner_read on public.submissions for select to authenticated using (
  exists(select 1 from public.citations c where c.id = citation_id and c.user_id = auth.uid())
);
-- Existing dashboard views must execute with the caller's RLS privileges.
do $$ begin
  if to_regclass('public.active_citations_dashboard') is not null then
    alter view public.active_citations_dashboard set (security_invoker = true);
  end if;
end $$;

create table if not exists public.service_payments (
  id uuid primary key default gen_random_uuid(), citation_id uuid not null references public.citations(id),
  user_id uuid not null references auth.users(id), amount_cents integer not null check(amount_cents >= 0),
  currency text not null default 'USD' check(currency = 'USD'),
  provider_order_id text unique, checkout_url text, provider_payment_id text unique,
  state text not null default 'pending' check(state in ('pending','paid')),
  promo_code text, fulfillment text not null default 'pending' check(fulfillment in ('pending','sending','sent')),
  fulfillment_started_at timestamptz, created_at timestamptz not null default now()
);
create unique index if not exists one_paid_service_per_citation on public.service_payments(citation_id) where state='paid';
create index if not exists service_payments_citation_idx on public.service_payments(citation_id);
alter table public.service_payments enable row level security;
-- No browser write policies: only service-role handlers can modify payment state.
create policy payment_owner_read on public.service_payments for select to authenticated using(user_id=auth.uid() or public.is_admin());

create table if not exists public.promo_campaigns (code text primary key, max_uses integer not null, uses integer not null default 0);
insert into public.promo_campaigns(code,max_uses) values('LAUNCH5',5) on conflict do nothing;
alter table public.promo_campaigns enable row level security;
-- Account for historical redemptions before enabling the new atomic reservation.
update public.promo_campaigns set uses = greatest(uses, (select count(*) from public.citations where promo_code='LAUNCH5')) where code='LAUNCH5';

create or replace function public.redeem_launch_promo(p_citation uuid, p_user uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare payment_id uuid;
begin
  perform 1 from public.citations where id=p_citation and user_id=p_user for update;
  if not found then raise exception 'Citation not found'; end if;
  select id into payment_id from public.service_payments where citation_id=p_citation and state='paid' limit 1;
  if payment_id is not null then return payment_id; end if;
  if exists(select 1 from public.service_payments where citation_id=p_citation and state='pending') then
    raise exception 'Checkout already started; complete or contact support to cancel before using a promotion';
  end if;
  update public.promo_campaigns set uses=uses+1 where code='LAUNCH5' and uses<max_uses;
  if not found then raise exception 'Promotion exhausted'; end if;
  insert into public.service_payments(citation_id,user_id,amount_cents,state,promo_code)
    values(p_citation,p_user,0,'paid','LAUNCH5') returning id into payment_id;
  update public.citations set service_fee_status='paid',promo_code='LAUNCH5',updated_at=now() where id=p_citation;
  return payment_id;
end $$;

-- Serialize checkout reservation and promo redemption on the citation row.
create or replace function public.reserve_service_checkout(p_citation uuid, p_user uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare payment_id uuid;
begin
  perform 1 from public.citations where id=p_citation and user_id=p_user for update;
  if not found then raise exception 'Citation not found'; end if;
  select id into payment_id from public.service_payments where citation_id=p_citation order by (state='paid') desc,created_at desc limit 1;
  if payment_id is not null then return payment_id; end if;
  insert into public.service_payments(citation_id,user_id,amount_cents) values(p_citation,p_user,7999) returning id into payment_id;
  return payment_id;
end $$;
revoke all on function public.reserve_service_checkout(uuid,uuid) from public,anon,authenticated;
grant execute on function public.reserve_service_checkout(uuid,uuid) to service_role;

create or replace function public.confirm_service_payment(p_id uuid, p_provider_payment text) returns void
language plpgsql security definer set search_path = '' as $$
declare c_id uuid;
begin
  update public.service_payments set state='paid',provider_payment_id=p_provider_payment
    where id=p_id and amount_cents=7999 and provider_order_id is not null returning citation_id into c_id;
  if not found then raise exception 'Payment not found'; end if;
  update public.citations set service_fee_status='paid',updated_at=now() where id=c_id;
end $$;
revoke all on function public.redeem_launch_promo(uuid,uuid) from public,anon,authenticated;
revoke all on function public.confirm_service_payment(uuid,text) from public,anon,authenticated;
grant execute on function public.redeem_launch_promo(uuid,uuid) to service_role;
grant execute on function public.confirm_service_payment(uuid,text) to service_role;

create table if not exists public.reminder_deliveries (
  citation_id uuid not null references public.citations(id), deadline text not null,
  channel text not null, day date not null default current_date,
  state text not null default 'claimed', created_at timestamptz not null default now(),
  primary key(citation_id,deadline,channel,day)
);
alter table public.reminder_deliveries enable row level security;
-- Explicit privileges so behavior does not depend on project default grants.
grant select on public.citations,public.service_payments to authenticated;
grant select on public.submissions to authenticated;
grant all on public.service_payments,public.promo_campaigns,public.reminder_deliveries to service_role;
commit;
