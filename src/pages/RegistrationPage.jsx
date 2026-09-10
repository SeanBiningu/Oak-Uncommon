import React, { useState } from 'react';
import { CalendarDays, Layers3, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { event, roles } from '../data/event';
import { StatCard } from '../components/ReferenceUI';
import { saveProfile } from '../data/store';
import { registerParticipant } from '../lib/eventApi';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../lib/auth';

const fields = [{ name: 'organisation', label: 'Organisation', placeholder: 'Your organisation name' }, { name: 'programmeArea', label: 'Sub-partner / programme area', placeholder: 'Optional', optional: true }, { name: 'email', label: 'Email address', placeholder: 'you@organisation.org', type: 'email' }, { name: 'phone', label: 'Phone number', placeholder: '+41 xx xxx xx xx', type: 'tel' }];
const requirements = [{ name: 'dietary', label: 'Dietary requirements', placeholder: 'e.g. Vegetarian, Halal, Gluten-free' }, { name: 'accessibility', label: 'Accessibility requirements', placeholder: 'e.g. Wheelchair access, hearing loop' }, { name: 'travel', label: 'Travel & accommodation', placeholder: 'e.g. Flight from London, hotel needed' }];
function Field({ label, optional, ...props }) { return <label className="form-field"><span>{label}{!optional && <b> *</b>}</span><input {...props} /></label>; }

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState(''); const [consent, setConsent] = useState(false);
  const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setError('');
    const data = new FormData(e.currentTarget);
    const profile = { eventId: event.id, firstName: data.get('firstName').trim(), lastName: data.get('lastName').trim(), organisation: data.get('organisation').trim(), programmeArea: data.get('programmeArea'), role, email: data.get('email').trim(), phone: data.get('phone').trim(), dietary: data.get('dietary'), accessibility: data.get('accessibility'), travel: data.get('travel') };
    try {
      setSubmitting(true);
      if (isSupabaseConfigured) {
        if (!user) { navigate('/access?next=/'); return; }
        if (!event.id) throw new Error('Set REACT_APP_EVENT_ID to the event UUID before accepting registrations.');
        const registered = await registerParticipant(profile);
        saveProfile({ ...profile, id: registered.registration_id, qrToken: registered.qr_token });
      } else {
        saveProfile({ ...profile, id: `OAK-2026-${Math.floor(1000 + Math.random() * 9000)}` });
      }
      navigate(role === 'Partner' ? '/qr-code' : role === 'Coordination Team' ? '/check-in' : '/program');
    } catch (requestError) { setError(requestError.message || 'Registration could not be saved. Please try again.'); } finally { setSubmitting(false); }
  };
  return <div className="reference-page"><main className="reference-column registration-screen"><section className="convening-banner"><h1>{event.name}</h1><p>{event.location} · {event.dates}</p></section><div className="registration-stats"><StatCard icon={Users} value={event.attendeeCount} label="Attendees" /><StatCard icon={CalendarDays} value={event.sessionCount} label="Sessions" /><StatCard icon={Layers3} value={event.partnerCount} label="Partners" /></div><form className="reference-card registration-form" onSubmit={submit}><h2>Registration Form</h2><div className="two-fields"><Field label="First name" name="firstName" placeholder="Maria" required /><Field label="Last name" name="lastName" placeholder="Schmidt" required /></div>{fields.slice(0, 2).map((field) => <Field key={field.name} {...field} required={!field.optional} />)}<label className="form-field"><span>Role / capacity <b>*</b></span><select name="role" value={role} onChange={(e) => setRole(e.target.value)} required><option value="">Select your role</option>{roles.map((item) => <option key={item}>{item}</option>)}</select></label>{fields.slice(2).map((field) => <Field key={field.name} {...field} required />)}<section className="requirements"><p>Requirements</p>{requirements.map((field) => <Field key={field.name} {...field} optional />)}</section><label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /><span>I agree to OAK Foundation's <u>privacy policy</u> and consent to my registration data being used for event coordination.</span></label>{error && <p className="camera-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Registering…' : 'Register'}</button></form><p className="privacy-note">Your data is secured and handled by OAK Foundation in accordance with GDPR.</p></main></div>;
}
