begin;
create table public.leads (
  id uuid primary key,
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  company text not null default '' check (char_length(company)<=150),
  country text not null check (char_length(country) between 2 and 80),
  service text not null check (service in ('Web Engineering','Software Engineering','AI & Automation','Digital Infrastructure','Multiple services','Not sure yet')),
  description text not null check (char_length(description) between 30 and 5000),
  budget text not null check (char_length(budget)<=200),
  timeline text not null check (char_length(timeline)<=100),
  website_url text not null default '' check (char_length(website_url)<=2048),
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  source text not null default 'website',
  consent_version text not null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_created_idx on public.leads (status,created_at desc);
create index leads_email_idx on public.leads (email);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select,insert,update,delete on public.leads to service_role;

create table public.lead_deliveries (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null check (kind in ('client_email','founder_email','crm')),
  status text not null default 'pending' check (status in ('pending','processing','sent','failed','skipped','needs_review')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(lead_id,kind)
);
create index deliveries_pending_idx on public.lead_deliveries(status,created_at) where status in ('pending','failed');
alter table public.lead_deliveries enable row level security;
revoke all on public.lead_deliveries from anon,authenticated;
grant all on public.lead_deliveries to service_role;
create function public.enqueue_lead_deliveries() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.lead_deliveries(lead_id,kind) values (new.id,'client_email'),(new.id,'founder_email'),(new.id,'crm');
  return new;
end $$;
revoke all on function public.enqueue_lead_deliveries() from public,anon,authenticated;
create trigger leads_outbox after insert on public.leads for each row execute function public.enqueue_lead_deliveries();
create function public.claim_delivery(delivery_id uuid) returns setof public.lead_deliveries language sql security definer set search_path='' as $$
  update public.lead_deliveries set status='processing',attempts=attempts+1,updated_at=now()
  where id=delivery_id and status in ('pending','failed') and attempts<20 returning *;
$$;
revoke all on function public.claim_delivery(uuid) from public,anon,authenticated;
grant execute on function public.claim_delivery(uuid) to service_role;

create table public.enquiry_rate_limits (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);
alter table public.enquiry_rate_limits enable row level security;
revoke all on public.enquiry_rate_limits from anon,authenticated;
grant all on public.enquiry_rate_limits to service_role;
create function public.check_enquiry_rate(bucket_key text) returns boolean language plpgsql security definer set search_path='' as $$
declare requests integer;
begin
  if char_length(bucket_key)<>64 then return false; end if;
  insert into public.enquiry_rate_limits(key) values(bucket_key)
  on conflict(key) do update set
    count=case when public.enquiry_rate_limits.window_start<now()-interval '10 minutes' then 1 else public.enquiry_rate_limits.count+1 end,
    window_start=case when public.enquiry_rate_limits.window_start<now()-interval '10 minutes' then now() else public.enquiry_rate_limits.window_start end
  returning count into requests;
  return requests<=5;
end $$;
revoke all on function public.check_enquiry_rate(text) from public,anon,authenticated;
grant execute on function public.check_enquiry_rate(text) to service_role;
commit;
-- Retention: schedule deletion of rate-limit rows older than 1 day, and review
-- unconverted leads after 180 days. See docs/operations.md. Never expose these tables.
