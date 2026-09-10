import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuthorization } from '../lib/auth';
import { getRegisteredProfile } from '../data/store';

const registeredRoleToAppRole = {
  Partner: 'participant',
  'OAK Staff': 'oak_staff',
  'Coordination Team': 'coordination_team',
  Presenter: 'presenter',
  Observer: 'observer',
};

export default function RequireAccess({ roles, children }) {
  const location = useLocation();
  const { user, role, loading } = useAuthorization();
  if (!isSupabaseConfigured) {
    const registeredProfile = getRegisteredProfile();
    const registeredRole = registeredRoleToAppRole[registeredProfile?.role];
    if (!registeredRole) return <Navigate to="/" replace />;
    if (!roles.includes(registeredRole)) return <Navigate to="/" replace />;
    return children;
  }
  if (loading) return <div className="reference-page"><main className="reference-column"><p>Checking access…</p></main></div>;
  if (!user) return <Navigate to={`/access?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (!roles.includes(role)) return <div className="reference-page"><main className="reference-column"><h1>Access not available</h1><p>Your account does not have permission to open this page. Ask an OAK administrator to assign the appropriate event role.</p></main></div>;
  return children;
}
