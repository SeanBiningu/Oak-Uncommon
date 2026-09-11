# Production deployment

1. Run every SQL migration under `supabase/migrations/` in timestamp order.
2. Deploy the optional confirmation-email function:
   `supabase functions deploy send-registration-confirmation`
3. Set server-side function secrets (never browser environment variables):
   `supabase secrets set RESEND_API_KEY=... APP_URL=https://your-domain.example MAIL_FROM="OAK Events <events@your-domain.example>"`
   Verify the sender domain with Resend first. The app still registers participants if email is not configured.
4. Deploy the React app to your preferred static host. Configure these build-time variables in the host dashboard:
   `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_PUBLISHABLE_KEY`, and `REACT_APP_EVENT_ID`.
5. Add the production domain and `http://localhost:3000` to Supabase Auth redirect URLs. In Resend, also verify the production sender domain.
6. Create one administrator deliberately in Supabase SQL Editor, using an existing Auth user UUID:

   ```sql
   update public.profiles set app_role = 'admin' where id = 'AUTH_USER_UUID';
   ```

7. Before launch, test registration, magic-link sign-in, each role's navigation, duplicate QR scan, and the real-time attendance view with separate accounts.

Use [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) as the final acceptance test.
