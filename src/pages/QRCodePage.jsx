import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { CalendarDays, Download, MapPin, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { event } from '../data/event';
import { getProfile } from '../data/store';

function Code({ value, container }) {
  useEffect(() => { if (container.current) container.current.replaceChildren(new BrowserQRCodeSvgWriter().write(value, 176, 176)); }, [container, value]);
  return <div className="qr-code" ref={container} aria-label={`QR entry code for ${value}`} />;
}

export default function QRCodePage() {
  const navigate = useNavigate(); const profile = getProfile(); const name = `${profile.firstName} ${profile.lastName}`; const qrContainer = useRef(null);
  const downloadPass = () => { const svg = qrContainer.current?.querySelector('svg'); if (!svg) return; const image = new Image(); const xml = new XMLSerializer().serializeToString(svg); const svgUrl = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })); image.onload = () => { const canvas = document.createElement('canvas'); canvas.width = 704; canvas.height = 704; canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `OAK-pass-${profile.id}.png`; link.click(); URL.revokeObjectURL(url); URL.revokeObjectURL(svgUrl); }, 'image/png'); }; image.src = svgUrl; };
  return <div className="reference-page"><main className="reference-column pass-screen"><header className="screen-heading"><span className="eyebrow">YOUR EVENT ACCESS</span><h1>Welcome, {profile.firstName}</h1><p>Your registration is confirmed. Keep this pass handy for arrival.</p></header><section className="entry-pass"><div className="pass-top"><span className="pass-brand">OAK <small>FOUNDATION</small></span><Ticket /><p>PARTNER CONVENING 2026</p><h2>{name}</h2><span>{profile.organisation} · {profile.role}</span></div><div className="pass-code"><Code container={qrContainer} value={profile.qrToken || profile.id} /><div><strong>{profile.id}</strong><span>Registration reference</span></div></div><div className="pass-bottom"><span><CalendarDays /> {event.dates}</span><span><MapPin /> {event.location}</span></div></section><button className="primary-button pass-download" onClick={downloadPass}><Download /> Download QR code (PNG)</button><button className="secondary-button" onClick={() => navigate('/check-in')}>Open check-in</button><section className="arrival-card reference-card"><div className="arrival-icon"><ShieldCheck /></div><div><strong>Ready for check-in</strong><p>Show this scannable QR code at the welcome desk, or enter its reference manually.</p></div></section><section className="event-details-card"><p className="reference-label">EVENT DETAILS</p><div><UserRound /><span><small>VENUE</small><strong>{event.venue}</strong></span></div><div><CalendarDays /><span><small>CHECK-IN OPENS</small><strong>Monday, 9 March · 08:00</strong></span></div></section></main></div>;
}
