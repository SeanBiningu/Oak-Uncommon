# Supabase setup

1. Create a Supabase project and run both files in `migrations/` in timestamp order (or use the Supabase CLI).
2. Seed the event and copy its UUID into `REACT_APP_EVENT_ID`:

```sql
insert into public.events (name, starts_on, ends_on, location, venue)
values ('OAK Foundation Event', '2026-11-09', '2026-11-11', 'TBD', 'TBD')
returning id;
```

3. Copy `.env.example` to `.env.local`, set the project URL, publishable key, and event UUID, then restart `npm start`.
4. Enable the Email provider in Supabase Auth and add your local and deployed URL to **Authentication → URL Configuration → Redirect URLs**. New users begin with the `participant` app role. Promote trusted coordination staff only from the SQL editor after their Auth account exists:

```sql
update public.profiles
set app_role = 'coordination_team'
where id = '<auth-user-uuid>';
```

The browser never receives a service-role key. The `check_in_by_qr` RPC only permits `coordination_team` or `admin`, records who performed the scan, and rejects duplicate scans.

Registration now requires a verified email link and records the Auth user ID with the participant record. Do not expose the `profiles` role editor to ordinary users.

The third migration enables the coordinator attendance dashboard and real-time refresh after each check-in. Run it before testing `/attendance`.
