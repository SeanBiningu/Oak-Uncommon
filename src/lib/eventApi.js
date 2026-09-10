import { isSupabaseConfigured, supabase } from './supabaseClient';

const requireClient = () => {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add .env.local from .env.example and restart the app.');
};

export async function registerParticipant(payload) {
  requireClient();
  const { data, error } = await supabase.rpc('register_for_event', {
    p_event_id: payload.eventId, p_first_name: payload.firstName, p_last_name: payload.lastName,
    p_organization: payload.organisation, p_sub_partner_program_area: payload.programmeArea || null,
    p_role: payload.role, p_email: payload.email, p_phone: payload.phone,
    p_dietary_requirements: payload.dietary || null, p_accessibility_requirements: payload.accessibility || null,
    p_travel_requirements: payload.travel || null, p_accommodation_requirements: payload.accommodation || null,
  });
  if (error) throw error;
  return data;
}

export async function checkInParticipant(eventId, qrValue) {
  requireClient();
  const { data, error } = await supabase.rpc('check_in_by_qr', { p_event_id: eventId, p_qr_value: qrValue });
  if (error) throw error;
  return data;
}

export async function getAttendanceDashboard(eventId) {
  requireClient();
  const { data, error } = await supabase.rpc('get_attendance_dashboard', { p_event_id: eventId });
  if (error) throw error;
  return data;
}
