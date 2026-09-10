import React, { useEffect, useState } from 'react';
import { Building2, CalendarDays, CircleUserRound, ClipboardCheck, Earth, ScanLine, Ticket, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { event } from '../data/event';
import { getRegisteredProfile } from '../data/store';

const icons = { register: ClipboardCheck, programme: CalendarDays, partners: Building2, checkin: ScanLine, attendance: Users, ticket: Ticket };
const navigationByRole = {
  Partner: [{ to: '/qr-code', label: 'My pass', icon: 'ticket' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
  'OAK Staff': [{ to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
  'Coordination Team': [{ to: '/check-in', label: 'Check In', icon: 'checkin' }, { to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }, { to: '/attendance', label: 'Attendance', icon: 'attendance' }],
  Presenter: [{ to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
  Observer: [{ to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
};

export default function EventShell({ children }) {
  const [profile, setProfile] = useState(getRegisteredProfile);
  useEffect(() => {
    const updateProfile = () => setProfile(getRegisteredProfile());
    window.addEventListener('oak-event-data-change', updateProfile);
    window.addEventListener('storage', updateProfile);
    return () => { window.removeEventListener('oak-event-data-change', updateProfile); window.removeEventListener('storage', updateProfile); };
  }, []);
  const navigation = [{ to: '/', label: 'Register', icon: 'register' }, ...(profile ? navigationByRole[profile.role] || [] : [])];
  const navLinks = (className) => navigation.map((item) => { const Icon = icons[item.icon]; return <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `${className} ${isActive ? 'active' : ''}`}><Icon /><span>{item.label}</span></NavLink>; });
  const name = profile ? `${profile.firstName} ${profile.lastName}` : null;
  return <div className="app-shell"><aside className="app-sidebar"><NavLink to="/" className="brand" aria-label="OAK Foundation home"><div className="brand-logo"><span className="brand-o-container">O<Earth className="brand-globe-overlay" /></span><span className="brand-ak">AK</span></div><span className="brand-foundation">FOUNDATION</span></NavLink><p className="convening-name">{event.name.toUpperCase()}</p><nav className="app-nav" aria-label="Event navigation">{navLinks('app-nav-link')}</nav>{profile && <div className="sidebar-footer sidebar-user"><CircleUserRound /><span><strong>{name}</strong><small>{profile.role}</small></span></div>}</aside><header className="mobile-event-header"><span className="mobile-oak">OAK</span><span>{event.name.toUpperCase()}</span></header><main className="app-content">{children}</main>{profile && <nav className="mobile-nav" aria-label="Event navigation">{navLinks('mobile-nav-link')}</nav>}</div>;
}
