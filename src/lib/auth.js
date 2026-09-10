import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Shared session hook for protected routes/screens added in the next milestone.
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);
  return { session, user: session?.user ?? null, loading };
}

export function useAuthorization() {
  const { user, loading: sessionLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(sessionLoading);
  useEffect(() => {
    if (sessionLoading) return undefined;
    if (!supabase || !user) { setRole(null); setLoading(false); return undefined; }
    setLoading(true);
    supabase.from('profiles').select('app_role').eq('id', user.id).single()
      .then(({ data }) => { setRole(data?.app_role ?? null); setLoading(false); });
    return undefined;
  }, [sessionLoading, user]);
  return { user, role, loading };
}
