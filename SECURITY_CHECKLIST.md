# Pre-launch checklist

Use separate test accounts; never promote an untrusted account just to test a route.

## Authentication and permissions

- A signed-out visitor is redirected to `/access` from protected pages.
- Partner: can open the QR pass and Partner Directory; cannot open Check-In, Attendance, Programme, or Admin.
- Presenter and Observer: can open Programme and Partners; cannot open QR, Check-In, Attendance, or Admin.
- OAK Staff: can open Programme and Partners only after an administrator assigns the role.
- Coordination Team: can open Check-In, Attendance, Programme, and Partners only after role assignment.
- Admin: can open `/admin`, publish a session and partner, and change a trusted registrant's role.
- A non-admin cannot call `admin_set_app_role` or insert/update/delete event content in the browser.

## Registration and attendance

- Registration requires a magic-link session and writes exactly one participant record.
- A Partner QR code contains the server-generated token, not personal data.
- A valid QR check-in creates one `check_ins` record and updates Attendance.
- Scanning the same QR again is rejected as a duplicate.
- A Coordinator sees the live attendance refresh after another Coordinator scans a pass.

## Production configuration

- Supabase Auth redirect URLs include localhost and the final HTTPS domain.
- All migrations have run in timestamp order.
- Only public publishable keys appear in browser environment variables; service-role and Resend keys are stored as Supabase Edge Function secrets.
- Email sender domain is verified before enabling registration confirmation email.
- The host uses HTTPS and its three `REACT_APP_*` build variables point to the production Supabase project.
