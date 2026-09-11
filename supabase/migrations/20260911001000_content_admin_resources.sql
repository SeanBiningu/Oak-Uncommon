-- Live event content, administrator management permissions, and private notes.
create table public.event_resources (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null, resource_url text not null, resource_type text not null default 'link',
  created_at timestamptz not null default now()
);
create index event_resources_event_id_idx on public.event_resources(event_id);

alter table public.event_resources enable row level security;
create policy "event members read resources" on public.event_resources for select to authenticated
  using ((select private.is_event_member(event_id)) or (select private.has_app_role(array['admin', 'oak_staff', 'coordination_team', 'presenter', 'observer']::public.app_role[])));
create policy "admins manage events" on public.events for all to authenticated using ((select private.has_app_role(array['admin']::public.app_role[]))) with check ((select private.has_app_role(array['admin']::public.app_role[])));
create policy "admins manage partners" on public.partners for all to authenticated using ((select private.has_app_role(array['admin']::public.app_role[]))) with check ((select private.has_app_role(array['admin']::public.app_role[])));
create policy "admins manage sessions" on public.sessions for all to authenticated using ((select private.has_app_role(array['admin']::public.app_role[]))) with check ((select private.has_app_role(array['admin']::public.app_role[])));
create policy "admins manage resources" on public.event_resources for all to authenticated using ((select private.has_app_role(array['admin']::public.app_role[]))) with check ((select private.has_app_role(array['admin']::public.app_role[])));
create policy "admins read profiles" on public.profiles for select to authenticated using ((select private.has_app_role(array['admin']::public.app_role[])));

grant select, insert, update, delete on public.events, public.partners, public.sessions, public.event_resources to authenticated;

create or replace function public.admin_set_app_role(p_user_id uuid, p_role public.app_role)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.has_app_role(array['admin']::public.app_role[]) then raise exception 'Not authorized' using errcode = '42501'; end if;
  update public.profiles set app_role = p_role where id = p_user_id;
  if not found then raise exception 'User profile not found'; end if;
end; $$;
grant execute on function public.admin_set_app_role(uuid, public.app_role) to authenticated;

create or replace function public.set_session_note_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger set_session_note_updated_at before update on public.session_notes for each row execute procedure public.set_session_note_updated_at();
