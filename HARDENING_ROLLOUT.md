# Website hardening — 22 October 2026

This branch implements the remaining CV audit items. It is not a production activation record.

## Changes

- Remaining homepage/about/gallery captions that still promoted water or pipe installation are aligned with civil construction and trenching.

- Named admin accounts with authenticator TOTP enrollment/challenge; only verified `app_metadata.role=admin` users at `aal2` can use privileged endpoints. Shared-password browser storage and API authentication are removed.
- Database restrictive MFA policies protect authenticated access even where earlier migrations created permissive policies. Anonymous public form insert policies remain separate.
- An insert trigger writes an internal notification and, when a real customer email exists, a customer receipt to a transactional outbox. An enquiry cannot commit without its notification tasks. Worker claims use row locking, leases, unique idempotency keys, exponential retries, immutable message snapshots and dead letters. Resend acceptance is recorded separately from actual inbox delivery; a provider acceptance is not evidence of delivery.
- Public form handlers only perform validated inserts. Workers perform outbound delivery. Old image URLs redirect to identical canonical blobs; `asset-cleanup.json` records exact SHA-based deletions and byte savings.
- Tests cover JWT/MFA boundaries, retry classification, migrated PostgreSQL transactions, RLS, lease recovery and dead letters. CI runs tests, TypeScript, lint and a production build.

## Activation order — requires the existing backend and hosting management access

1. Take a database restore point and use a staging branch/project first. These migrations target the current existing database; this work does not change database vendors. Verify the live schema matches the checked-in migration history.
2. Keep public signup disabled. Use the existing Auth administration interface/API to create or invite individual operators, with separate passwords. Grant each approved account `app_metadata.role = "admin"` through the trusted Admin API (never through `user_metadata` or a public client). Enable TOTP MFA. Use an administrator-controlled recovery process for a lost factor; no password-only fallback is provided.
3. Apply the new `20261022...` migrations in filename order. Test both admin and anonymous sessions. The restrictive policy intentionally denies all non-admin authenticated sessions; check any other existing authenticated application that shares this database before activation.
4. Configure server-only `SUPABASE_SERVICE_ROLE_KEY` for admin APIs and the same high-entropy `CRON_SECRET` in Vercel and backend function secrets. The public URL and anonymous key must refer to this business's own database.
5. Configure backend secrets `RESEND_API_KEY`, `NOTIFICATION_FROM` (verified sender), `NOTIFICATION_TO` (comma-separated approved internal recipients) and `NOTIFICATION_REPLY_TO`. Preserve each business's own recipients and branding. Configuration is required before running the worker; the code deliberately does not guess recipients.
6. Deploy the JWT-protected backend functions, including the replacement for any legacy shared-password endpoint; coordinate this with the application release so operators are not left with a mismatched login flow. Deploy `notification-worker`. Deploy the new application and cron configuration. The five-minute Vercel schedule requires a plan that supports that frequency; otherwise configure the existing backend scheduler to call the same worker with its cron secret. Verify cron execution logs.
   Robb & Taylor functions: `admin-quotes` and `notification-worker`. Deploy the checked-in replacement `admin-quotes` function to close the old password-based URL; replacing only the frontend does not secure a previously deployed function. Deploy the checked-in retired `send-quote-email` handler after the new server form and outbox are active. Remove its shared-password secrets.
7. Sign in with each operator, enroll an authenticator and verify access. Confirm a password-only session is rejected by API and RLS, an unauthorized account sees no enquiries, expiry/refresh works, and sign-out revokes access in the UI.
8. Submit one clearly marked staging test enquiry, check its outbox rows, simulate a provider failure and a worker interruption, and verify successful retry does not duplicate provider requests. Confirm a provider message ID and actual receipt in approved test inboxes. Do not treat a `sent` outbox row as confirmed delivery.
9. Complete the same end-to-end production verification during the release window, with a marked test record that is cleaned up afterwards. Until this is done, production regression testing and live MFA/email activation remain pending.

## Operations

Inspect pending/dead notifications in `notification_outbox` through a trusted database console/service-role integration. Dead-letter records retain failure class, attempt count and timestamps. Reconcile provider logs before requeueing any ambiguous send. Keys are retained by Resend for 24 hours; attempted jobs stop automatically before that window can expire. Unattempted jobs can wait safely for configuration. Do not alter a stored message or its idempotency key when retrying an ambiguous request. For an intentional new send after reconciliation, create a new task with a new key and retain the audit trail.

The existing outbound templates and follow-up automation still depend on their existing settings. Backend function type checks are separate from Next.js checks because those functions use the Deno runtime.

## Verification recorded for this branch

- `npm test`: passes in both repositories (three tests comprising security, retry and PostgreSQL assertions per repository).
- `npm run typecheck`: passes in both repositories.
- `npm run lint`: passes with existing non-blocking font/analytics warnings.
- `npm run build`: passes with existing dependency/browserslist warnings.
- Deno checks for changed live backend functions: pass using the installed SDK versions.
- Local Chromium checks passed for four key page routes per business, anonymous admin/cron rejection (401), legacy image redirects (308), intercepted quote/callback success, FAQ interaction (EMT), thank-you navigation (Robb & Taylor), mobile width and zero page runtime errors. Intercepted responses do not verify live persistence or inbox delivery. Run `npm run test:browser` after a build; install Chromium with `npx playwright install chromium` or set `BROWSER_EXECUTABLE`.

All 17 canonical image destinations retained by the duplicate cleanup also returned HTTP 200 on the existing production sites.

A read-only HTTP smoke check of the existing production sites returned 200 for all 15 checked home, contact, service, admin login, sitemap and robots routes across both businesses. This checks the currently deployed sites; it does not verify deployment of this branch.

Vercel project inspection returned HTTP 403 for the connected project's team scope. No backend management connection is available in this session. No migrations, account provisioning, function deployment or production application promotion has been performed.
