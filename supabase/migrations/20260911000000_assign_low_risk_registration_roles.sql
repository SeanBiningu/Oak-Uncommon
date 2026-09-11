-- Verified Presenter and Observer registrations receive the matching app role.
-- OAK Staff, Coordination Team, and admin access remain administrator-assigned:
-- a public registration form must never grant operational privileges.
create or replace function public.register_for_event(
  p_event_id uuid, p_first_name text, p_last_name text, p_organization text, p_sub_partner_program_area text,
  p_role public.participant_role, p_email text, p_phone text, p_dietary_requirements text,
  p_accessibility_requirements text, p_travel_requirements text, p_accommodation_requirements text
) returns public.participants language plpgsql security definer set search_path = '' as $$
declare new_participant public.participants;
begin
  if auth.uid() is null then raise exception 'Sign in before registering' using errcode = '42501'; end if;
  if not exists (select 1 from public.events where id = p_event_id) then raise exception 'Event not found'; end if;

  insert into public.participants (event_id, user_id, first_name, last_name, organization, sub_partner_program_area, role, email, phone, dietary_requirements, accessibility_requirements, travel_requirements, accommodation_requirements)
  values (p_event_id, auth.uid(), trim(p_first_name), trim(p_last_name), trim(p_organization), nullif(trim(p_sub_partner_program_area), ''), p_role, lower(trim(p_email)), trim(p_phone), nullif(trim(p_dietary_requirements), ''), nullif(trim(p_accessibility_requirements), ''), nullif(trim(p_travel_requirements), ''), nullif(trim(p_accommodation_requirements), ''))
  returning * into new_participant;

  update public.profiles
  set app_role = case p_role
    when 'Presenter' then 'presenter'::public.app_role
    when 'Observer' then 'observer'::public.app_role
    else app_role
  end
  where id = auth.uid()
    and app_role in ('participant', 'presenter', 'observer');

  return new_participant;
end; $$;
