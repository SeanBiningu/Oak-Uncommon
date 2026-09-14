import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { CalendarDays, CircleCheck, Download, MapPin, RotateCcw } from 'lucide-react';
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
  const details = [
    ['Name', name],
    ['Organisation', profile.organisation],
    ['Role', profile.role],
    ['Email', profile.email || '—'],
    ['Event Dates', event.dates],
    ['Location', event.location],
  ];
  return <div className="reference-page pass-page"><main className="reference-column pass-screen">
    <section className="pass-confirmation"><CircleCheck /><div><small>REGISTRATION COMPLETE</small><h1>You’re Registered,<br />{profile.firstName}!</h1><p>{profile.organisation}</p></div></section>
    <section className="entry-pass">
      <div className="pass-event"><span>OAK</span><p>{event.name}</p></div>
      <p className="pass-kicker">YOUR ENTRY PASS</p>
      <Code value={profile.qrToken || profile.id} />
      <strong>{profile.id}</strong><span>Present this code at the event entrance</span>
      <footer><span><CalendarDays /> {event.dates}</span><span><MapPin /> {event.location}</span></footer>
    </section>
    <section className="pass-details"><p>REGISTRATION DETAILS</p>{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
    <button className="primary-button pass-download" onClick={downloadPass}><Download /> Download QR Code</button>
    <button className="register-another" onClick={() => navigate('/')}><RotateCcw /> Register another attendee</button>
  </main></div>;
}
