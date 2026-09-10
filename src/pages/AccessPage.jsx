import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AccessPage() {
  const navigate = useNavigate(); const [params] = useSearchParams();
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [sending, setSending] = useState(false);
  const next = params.get('next') || '/';
  const sendLink = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    try {
      setSending(true);
      const { error: authError } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${next}` } });
      if (authError) throw authError;
      setMessage('Check your email for a secure sign-in link.');
    } catch (requestError) { setError(requestError.message || 'We could not send a sign-in link.'); } finally { setSending(false); }
  };
  return <div className="reference-page"><main className="reference-column registration-screen"><section className="reference-card registration-form"><h1>Event access</h1><p>Use your email address to receive a secure sign-in link.</p><form onSubmit={sendLink}><label className="form-field"><span>Email address <b>*</b></span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@organisation.org" /></label>{error && <p className="camera-error" role="alert">{error}</p>}{message && <p role="status">{message}</p>}<button className="primary-button" disabled={sending}>{sending ? 'Sending…' : 'Email me a sign-in link'}</button></form><button className="secondary-button" onClick={() => navigate('/')}>Back to registration</button></section></main></div>;
}
