import React from 'react';
import { Building2, CalendarDays, ClipboardCheck, ScanLine, Ticket, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { event, internalNavigation } from '../data/event';

const icons = { register: ClipboardCheck, programme: CalendarDays, partners: Building2, checkin: ScanLine, attendance: Users, ticket: Ticket };
export default function EventShell({ children }) { const navigation = internalNavigation; return <div className="app-shell"><aside className="app-sidebar"><NavLink to="/" className="brand" aria-label="OAK Foundation home"><span className="brand-mark">OAK</span><span><strong>OAK</strong><small>FOUNDATION</small></span></NavLink><p className="convening-name">{event.name.toUpperCase()}</p><nav className="app-nav" aria-label="Event navigation">{navigation.map((item) => { const Icon = icons[item.icon]; return <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}><Icon /><span>{item.label}</span></NavLink>; })}</nav><div className="sidebar-footer">{event.location}<br /><small>{event.dates}</small></div></aside><main className="app-content">{children}</main></div>; }
