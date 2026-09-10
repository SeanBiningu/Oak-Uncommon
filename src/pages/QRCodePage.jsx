import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { CalendarDays, Download, MapPin, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { event } from '../data/event';
import { getProfile } from '../data/store';

function Code({ value }) {
  const container = useRef(null);
  useEffect(() => { if (container.current) container.current.replaceChildren(new BrowserQRCodeSvgWriter().write(value, 176, 176)); }, [value]);
  return <div className="qr-code" ref={container} aria-label={`QR entry code for ${value}`} />;
}

export default function QRCodePage() {
  const navigate = useNavigate(); const profile = getProfile(); const name = `${profile.firstName} ${profile.lastName}`;
  const downloadPass = () => { const text = `${event.name}\n${name}\n${profile.organisation} · ${profile.role}\nPass: ${profile.id}\n${event.dates} · ${event.location}`; const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); const link = document.createElement('a'); link.href = url; link.download = `OAK-pass-${profile.id}.txt`; link.click(); URL.revokeObjectURL(url); };
  return <div className="reference-page"><main className="reference-column pass-screen"><header className="screen-heading"><span className="eyebrow">YOUR EVENT ACCESS</span><h1>Welcome, {profile.firstName}</h1><p>Your registration is confirmed. Keep this pass handy for arrival.</p></header><section className="entry-pass"><div className="pass-top"><span className="pass-brand">OAK <small>FOUNDATION</small></span><Ticket /><p>PARTNER CONVENING 2026</p><h2>{name}</h2><span>{profile.organisation} · {profile.role}</span></div><div className="pass-code"><Code value={profile.id} /><div><strong>{profile.id}</strong><span>Registration reference</span></div></div><div className="pass-bottom"><span><CalendarDays /> {event.dates}</span><span><MapPin /> {event.location}</span></div></section><button className="primary-button pass-download" onClick={downloadPass}><Download /> Download pass</button><button className="secondary-button" onClick={() => navigate('/check-in')}>Open check-in</button><section className="arrival-card reference-card"><div className="arrival-icon"><ShieldCheck /></div><div><strong>Ready for check-in</strong><p>Show this scannable QR code at the welcome desk, or enter its reference manually.</p></div></section><section className="event-details-card"><p className="reference-label">EVENT DETAILS</p><div><UserRound /><span><small>VENUE</small><strong>{event.venue}</strong></span></div><div><CalendarDays /><span><small>CHECK-IN OPENS</small><strong>Monday, 9 March · 08:00</strong></span></div></section></main></div>;
}
