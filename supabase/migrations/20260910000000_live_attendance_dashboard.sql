-- Coordinator-only attendance summary. Keeps participant contact details out of
-- the browser unless the authenticated user is authorised to run attendance.
create or replace function public.get_attendance_dashboard(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare report jsonb;
begin
  if not private.has_app_role(array['admin', 'coordination_team']::public.app_role[]) then
    raise exception 'Not authorized to view attendance' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'totalRegistered', count(*) filter (where p.registration_status = 'registered'),
    'totalAttendees', count(c.id),
    'attendancePercentage', case when count(*) filter (where p.registration_status = 'registered') = 0 then 0 else round((count(c.id)::numeric / (count(*) filter (where p.registration_status = 'registered'))) * 100) end,
    'arrivals', coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'name', concat_ws(' ', p.first_name, p.last_name), 'organization', p.organization,
      'role', p.role, 'registeredAt', p.registered_at, 'checkedInAt', c.checked_in_at
    ) order by c.checked_in_at desc) filter (where c.id is not null), '[]'::jsonb)
  ) into report
  from public.participants p
  left join public.check_ins c on c.participant_id = p.id
  where p.event_id = p_event_id;
  return report;
end; $$;

grant execute on function public.get_attendance_dashboard(uuid) to authenticated;

