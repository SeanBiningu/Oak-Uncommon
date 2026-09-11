import React, { useEffect, useState } from 'react';
import { Building2, CalendarDays, CircleUserRound, ClipboardCheck, ScanLine, Ticket, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { event } from '../data/event';
import { getRegisteredProfile } from '../data/store';
import { useAuthorization } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const icons = { register: ClipboardCheck, programme: CalendarDays, partners: Building2, checkin: ScanLine, attendance: Users, ticket: Ticket };
const navigationByRole = {
  Partner: [{ to: '/qr-code', label: 'My pass', icon: 'ticket' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
  'OAK Staff': [{ to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
  'Coordination Team': [{ to: '/check-in', label: 'Check In', icon: 'checkin' }, { to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }, { to: '/attendance', label: 'Attendance', icon: 'attendance' }],
  Presenter: [{ to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
  Observer: [{ to: '/program', label: 'Programme', icon: 'programme' }, { to: '/partners', label: 'Partners', icon: 'partners' }],
};
const navigationByAppRole = {
  participant: navigationByRole.Partner,
  oak_staff: navigationByRole['OAK Staff'],
  coordination_team: navigationByRole['Coordination Team'],
  presenter: navigationByRole.Presenter,
  observer: navigationByRole.Observer,
  admin: [...navigationByRole['Coordination Team'], { to: '/admin', label: 'Admin', icon: 'attendance' }],
};

export default function EventShell({ children }) {
  const [profile, setProfile] = useState(getRegisteredProfile);
  const { role: appRole } = useAuthorization();
  useEffect(() => {
    const updateProfile = () => setProfile(getRegisteredProfile());
    window.addEventListener('oak-event-data-change', updateProfile);
    window.addEventListener('storage', updateProfile);
    return () => { window.removeEventListener('oak-event-data-change', updateProfile); window.removeEventListener('storage', updateProfile); };
  }, []);
  const permittedNavigation = isSupabaseConfigured ? navigationByAppRole[appRole] || [] : profile ? navigationByRole[profile.role] || [] : [];
  const navigation = [{ to: '/', label: 'Register', icon: 'register' }, ...permittedNavigation];
  const navLinks = (className) => navigation.map((item) => { const Icon = icons[item.icon]; return <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `${className} ${isActive ? 'active' : ''}`}><Icon /><span>{item.label}</span></NavLink>; });
  const name = profile ? `${profile.firstName} ${profile.lastName}` : null;
  return <div className="app-shell"><aside className="app-sidebar"><NavLink to="/" className="brand" aria-label="OAK Foundation home"><img className="brand-image" src="/oak-foundation-logo.svg" alt="OAK Foundation" /></NavLink><p className="convening-name">{event.name.toUpperCase()}</p><nav className="app-nav" aria-label="Event navigation">{navLinks('app-nav-link')}</nav>{profile && <div className="sidebar-footer sidebar-user"><CircleUserRound /><span><strong>{name}</strong><small>{profile.role}</small></span></div>}</aside><header className="mobile-event-header"><img className="mobile-oak" src="/oak-foundation-logo.svg" alt="OAK Foundation" /><span>{event.name.toUpperCase()}</span></header><main className="app-content">{children}</main>{profile && <nav className="mobile-nav" aria-label="Event navigation">{navLinks('mobile-nav-link')}</nav>}</div>;
}
