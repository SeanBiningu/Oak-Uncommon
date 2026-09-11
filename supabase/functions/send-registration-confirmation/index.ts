import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const authorization = request.headers.get('Authorization') ?? ''
  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } })
  const { data: { user } } = await client.auth.getUser()
  const { participantId } = await request.json()
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: participant, error } = await admin.from('participants').select('first_name,last_name,email,organization,registration_id,role,event_id').eq('id', participantId).eq('user_id', user?.id ?? '').single()
  if (error || !participant) return new Response(JSON.stringify({ error: 'Participant not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  const { data: event } = await admin.from('events').select('name,starts_on,ends_on,venue,location').eq('id', participant.event_id).single()
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) return new Response(JSON.stringify({ skipped: 'Email provider is not configured' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  const appUrl = Deno.env.get('APP_URL') ?? ''
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: Deno.env.get('MAIL_FROM') ?? 'OAK Events <onboarding@resend.dev>', to: [participant.email], subject: `${event?.name ?? 'OAK Event'} registration confirmed`, html: `<h1>Registration confirmed</h1><p>Hello ${participant.first_name},</p><p>Your registration ID is <strong>${participant.registration_id}</strong>.</p><p>${event?.name ?? ''}<br>${event?.starts_on ?? ''} to ${event?.ends_on ?? ''}<br>${event?.venue ?? event?.location ?? ''}</p><p><a href="${appUrl}/qr-code">Open your event pass</a></p>` }) })
  if (!response.ok) return new Response(await response.text(), { status: 502, headers: corsHeaders })
  return new Response(JSON.stringify({ sent: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
