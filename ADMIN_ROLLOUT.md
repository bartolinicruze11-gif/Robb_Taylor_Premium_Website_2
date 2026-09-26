# Robb & Taylor admin rollout

The homepage EMT promotion was removed in the separate main-branch commit. The
admin and notification changes in this branch need a coordinated rollout in a
separate Bolt project; deploying only the frontend would leave its new API
without tables and server credentials. The code uses a Supabase-compatible
client, while Bolt manages the actual database. SQL files in GitHub are schema
specifications and are not automatically applied to Bolt Database. Bolt's
unclaimed database does not offer a general SQL editor; verify that Bolt can
apply the required tables, trigger, policies and claim function before deploying.

## Audit findings addressed

- The previous admin was a single enquiry list using a shared password sent
  from the browser to a service-role Edge Function. The new workspace uses
  named accounts in Bolt's authentication system with a server-managed `robb_admin` role and TOTP
  verification. The legacy endpoint is retired only after migration.
- Previous saves displayed success without checking the API response. The
  new server validates fields and returns errors. Changes create per-user
  activity records. Every save sends the version the operator viewed, so
  concurrent edits return a conflict rather than silently overwriting a newer
  record.
- The old dashboard had no follow-up due dates, priority, or delivery history.
  These are stored in the database. Pipeline and service metrics count actual
  enquiries; a closed stage is not presented as won revenue. The focus queue
  links new, due, unassigned and urgent leads directly to the working inbox.
- The public form previously fired a best-effort email function from the
  browser. A database trigger now creates a durable, unique admin-alert record
  for each new enquiry. A protected daily worker claims due records, sends
  through Resend with an idempotency key, and retries failures. The existing
  customer-facing email behavior remains separate.
- The dependency audit reduced production findings from the older framework
  and dependencies, but npm still reports one high and one moderate advisory
  on Next.js 15's bundled PostCSS. Clearing them requires a separate Next.js
  16 and React compatibility migration; do not treat this branch as an all-clear
  security audit. The admin metrics currently cover the most recent 500 leads.

## Staging sequence

1. Create a separate Bolt project and export existing records. Bolt version
   history does not restore database contents. Have the Bolt database workflow
   apply and verify the schema and policies in
   `supabase/migrations/20260924010000_admin_workspace_and_notifications.sql`.
   Confirm anonymous INSERT still works and anonymous SELECT/UPDATE fails.
   Existing enquiries are not bulk-emailed.
   If Bolt cannot apply the outbox trigger or claim function, stop this rollout
   and rework the worker for the supported Bolt Database APIs; do not switch
   databases implicitly.
2. Provision named Auth users through Bolt's User Management. Assign
   `app_metadata.role = "robb_admin"` using an administrator or service-role
   operation, never from client-editable user metadata. Enrol and verify TOTP.
3. Configure these **server-only** Vercel environment variables in staging:
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`,
   `ROBB_NOTIFICATION_FROM` (a verified Robb & Taylor sender domain), and
   `ROBB_NOTIFICATION_TO` (Cruze's confirmed Gmail inbox). Existing
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` stay
   configured for Auth and public submissions. Do not commit secret values.
4. Deploy this Next.js branch to staging and test sign-in, MFA, lead list,
   status/priority/notes/follow-up edits, activity, CSV export, and concurrent
   updates. Submit a test enquiry and run “Send pending now”; verify exactly one
   email is received, then exercise a failed delivery and retry.
5. Apply and verify the schema in the live Bolt Database, then deploy the
   frontend. Retire the old
   shared-password `admin-quotes` Edge Function with the replacement stub in
   this branch, then revoke its historic password. Check the admin path and
   email queue after the scheduled worker runs. The Vercel cron is set to
   19:00 UTC daily (07:00 NZST / 08:00 NZDT).

Email sends remain disabled until the sender domain and server secrets are
configured. Public quote submissions continue to use the existing form and
database insert path. The new alert queue is specifically for the admin inbox.
