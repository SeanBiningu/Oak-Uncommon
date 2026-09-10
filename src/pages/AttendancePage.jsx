import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ScanLine, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { event } from '../data/event';
import { getAttendanceDashboard } from '../lib/eventApi';
import { supabase } from '../lib/supabaseClient';

const formatTime = (iso) => new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const initials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export default function AttendancePage() {
  const navigate = useNavigate(); const [search, setSearch] = useState('');
  const [dashboard, setDashboard] = useState({ totalRegistered: 0, totalAttendees: 0, attendancePercentage: 0, arrivals: [] });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try { const report = await getAttendanceDashboard(event.id); if (active) { setDashboard(report); setError(''); } }
      catch (requestError) { if (active) setError(requestError.message || 'Attendance data could not be loaded.'); }
      finally { if (active) setLoading(false); }
    };
    refresh();
    const channel = supabase.channel(`attendance-${event.id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'check_ins' }, refresh).subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);
  const arrivals = useMemo(() => dashboard.arrivals || [], [dashboard.arrivals]);
  const visible = useMemo(() => arrivals.filter((person) => `${person.name} ${person.organization} ${person.role}`.toLowerCase().includes(search.toLowerCase())), [arrivals, search]);
  const remaining = Math.max(0, Number(dashboard.totalRegistered) - Number(dashboard.totalAttendees));
  return <div className="reference-page internal-page"><main className="attendance-wrap"><header className="split-heading"><div><span className="eyebrow">EVENT TEAM</span><h1>Attendance</h1><p>Live arrival tracking for {event.name}.</p></div><button onClick={() => navigate('/check-in')}><ScanLine /> Open scanner</button></header><section className="attendance-metrics"><article><Users /><strong>{dashboard.totalAttendees}</strong><span>Checked in</span><small>{dashboard.attendancePercentage}% of registered</small></article><article><strong>{dashboard.totalRegistered}</strong><span>Registered</span><small>Across all roles</small></article><article><strong>{remaining}</strong><span>Still to arrive</span><small>Updates after every scan</small></article></section><section className="arrivals-card reference-card"><header><div><h2>Recent arrivals</h2><p>{loading ? 'Loading attendance…' : 'Live scan activity'}</p></div><label><Search /><input value={search} onChange={(item) => setSearch(item.target.value)} placeholder="Search attendees" /></label></header>{error && <p className="camera-error" role="alert">{error}</p>}{!loading && !visible.length && <p className="empty-notes">No checked-in participants yet.</p>}{visible.map((person) => <div className="arrival-row" key={person.id}><span className="avatar">{initials(person.name)}</span><span><strong>{person.name}</strong><small>{person.organization} · {person.role}</small></span><span className="arrival-time"><strong>{formatTime(person.checkedInAt)}</strong><small>Checked in</small></span><ArrowUpRight /></div>)}</section></main></div>;
}
