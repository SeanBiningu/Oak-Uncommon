-- OAK Event Attendance Platform - initial schema, Row Level Security, and RPCs.
create extension if not exists pgcrypto;

create type public.participant_role as enum ('Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer');
create type public.app_role as enum ('participant', 'oak_staff', 'coordination_team', 'presenter', 'observer', 'admin');

create table public.events (
  id uuid primary key default gen_random_uuid(), name text not null,
  starts_on date not null, ends_on date not null check (ends_on >= starts_on),
  venue text, location text, created_at timestamptz not null default now()
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  app_role public.app_role not null default 'participant', created_at timestamptz not null default now()
);
create table public.participants (
  id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid unique references auth.users(id) on delete set null,
  first_name text not null check (char_length(trim(first_name)) > 0), last_name text not null check (char_length(trim(last_name)) > 0),
  organization text not null check (char_length(trim(organization)) > 0), sub_partner_program_area text,
  role public.participant_role not null, email text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'), phone text not null,
  dietary_requirements text, accessibility_requirements text, travel_requirements text, accommodation_requirements text,
  registration_id text not null unique default ('OAK-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  qr_token uuid not null unique default gen_random_uuid(), registration_status text not null default 'registered' check (registration_status in ('registered', 'cancelled')),
  registered_at timestamptz not null default now(), unique (event_id, email)
);
create table public.check_ins (
  id uuid primary key default gen_random_uuid(), participant_id uuid not null unique references public.participants(id) on delete cascade,
  checked_in_by uuid not null references auth.users(id), checked_in_at timestamptz not null default now()
);
create table public.partners (
  id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
  name text not null, logo_url text, description text, website_url text, contact_name text, contact_email text,
  areas_of_work text[] not null default '{}', created_at timestamptz not null default now(), unique (event_id, name)
);
create table public.sessions (
  id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
  starts_at timestamptz not null, ends_at timestamptz not null check (ends_at > starts_at), title text not null,
  speaker text, venue text, description text, created_at timestamptz not null default now()
);
create table public.session_notes (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.sessions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade, body text not null check (char_length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index participants_event_id_idx on public.participants(event_id);
create index sessions_event_starts_at_idx on public.sessions(event_id, starts_at);

-- New auth users are always least-privileged. Promote trusted team members only in SQL/dashboard.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id) values (new.id); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create schema if not exists private;
create or replace function private.has_app_role(required_roles public.app_role[]) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.app_role = any(required_roles));
$$;
create or replace function private.is_event_member(target_event uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.participants p where p.event_id = target_event and p.user_id = (select auth.uid()));
$$;

alter table public.events enable row level security; alter table public.profiles enable row level security;
alter table public.participants enable row level security; alter table public.check_ins enable row level security;
alter table public.partners enable row level security; alter table public.sessions enable row level security; alter table public.session_notes enable row level security;
create policy "event members read event" on public.events for select to authenticated using ((select private.is_event_member(id)) or (select private.has_app_role(array['admin', 'oak_staff', 'coordination_team']::public.app_role[])));
create policy "users read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "users read own participant record" on public.participants for select to authenticated using (user_id = (select auth.uid()) or (select private.has_app_role(array['admin', 'coordination_team']::public.app_role[])));
create policy "coordinators read checkins" on public.check_ins for select to authenticated using ((select private.has_app_role(array['admin', 'coordination_team']::public.app_role[])));
create policy "event members read partners" on public.partners for select to authenticated using ((select private.is_event_member(event_id)) or (select private.has_app_role(array['admin', 'oak_staff', 'coordination_team']::public.app_role[])));
create policy "authorized users read sessions" on public.sessions for select to authenticated using ((select private.has_app_role(array['admin', 'oak_staff', 'coordination_team', 'presenter', 'observer']::public.app_role[])));
create policy "users manage own notes" on public.session_notes for all to authenticated using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));

-- The public registration function is the only anonymous write path. Browser roles never grant app privileges.
create or replace function public.register_for_event(
  p_event_id uuid, p_first_name text, p_last_name text, p_organization text, p_sub_partner_program_area text,
  p_role public.participant_role, p_email text, p_phone text, p_dietary_requirements text,
  p_accessibility_requirements text, p_travel_requirements text, p_accommodation_requirements text
) returns public.participants language plpgsql security definer set search_path = '' as $$
declare new_participant public.participants;
begin
  if not exists (select 1 from public.events where id = p_event_id) then raise exception 'Event not found'; end if;
  insert into public.participants (event_id, user_id, first_name, last_name, organization, sub_partner_program_area, role, email, phone, dietary_requirements, accessibility_requirements, travel_requirements, accommodation_requirements)
  values (p_event_id, auth.uid(), trim(p_first_name), trim(p_last_name), trim(p_organization), nullif(trim(p_sub_partner_program_area), ''), p_role, lower(trim(p_email)), trim(p_phone), nullif(trim(p_dietary_requirements), ''), nullif(trim(p_accessibility_requirements), ''), nullif(trim(p_travel_requirements), ''), nullif(trim(p_accommodation_requirements), '')) returning * into new_participant;
  return new_participant;
end; $$;

create or replace function public.check_in_by_qr(p_event_id uuid, p_qr_value text)
returns table (participant_id uuid, first_name text, last_name text, organization text, role public.participant_role, registration_id text, checked_in_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare target public.participants; declare checkin_time timestamptz;
begin
  if not private.has_app_role(array['admin', 'coordination_team']::public.app_role[]) then raise exception 'Not authorized to check in participants' using errcode = '42501'; end if;
  select * into target from public.participants where event_id = p_event_id and registration_status = 'registered' and (qr_token::text = p_qr_value or registration_id = upper(trim(p_qr_value)));
  if not found then raise exception 'QR code not recognized' using errcode = 'P0002'; end if;
  insert into public.check_ins (participant_id, checked_in_by) values (target.id, auth.uid()) returning public.check_ins.checked_in_at into checkin_time;
  return query select target.id, target.first_name, target.last_name, target.organization, target.role, target.registration_id, checkin_time;
exception when unique_violation then raise exception 'Participant has already checked in' using errcode = '23505'; end; $$;

revoke all on all tables in schema public from anon;
grant select on public.events, public.profiles, public.participants, public.check_ins, public.partners, public.sessions, public.session_notes to authenticated;
grant insert, update, delete on public.session_notes to authenticated;
grant execute on function public.register_for_event(uuid, text, text, text, text, public.participant_role, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.check_in_by_qr(uuid, text) to authenticated;
