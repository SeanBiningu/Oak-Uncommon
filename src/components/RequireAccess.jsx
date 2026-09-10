import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuthorization } from '../lib/auth';

export default function RequireAccess({ roles, children }) {
  const location = useLocation();
  const { user, role, loading } = useAuthorization();
  if (!isSupabaseConfigured) return children;
  if (loading) return <div className="reference-page"><main className="reference-column"><p>Checking access…</p></main></div>;
  if (!user) return <Navigate to={`/access?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (!roles.includes(role)) return <div className="reference-page"><main className="reference-column"><h1>Access not available</h1><p>Your account does not have permission to open this page. Ask an OAK administrator to assign the appropriate event role.</p></main></div>;
  return children;
}
