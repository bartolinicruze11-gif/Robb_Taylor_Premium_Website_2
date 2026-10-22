# Robb & Taylor admin email alerts

Destination: bartolinicruze11@gmail.com (verified connected Gmail profile).

This feature sends a new-enquiry alert from the server after the enquiry has been saved. Both homepage and contact forms use the same route. The current business/customer email integration is also awaited and retained. The admin dashboard shows configuration status and has an authenticated test button.

## Activation

1. In the existing Vercel project, set RESEND_API_KEY and ADMIN_NOTIFICATION_FROM using an approved/verified Resend sender. Keep these server-only and scoped to production; use separate preview/test credentials.
2. ADMIN_NOTIFICATION_TO defaults to bartolinicruze11@gmail.com. Set it explicitly if your operating configuration requires it. This does not replace the existing business recipient.
3. Deploy the branch, sign in to the admin dashboard and send a test. Provider acceptance does not prove inbox delivery; verify the actual inbox and spam folder.
4. Submit one clearly labelled test enquiry from each form, check it exists in admin and check the alert. Remove only those test records after verification.

No new database schema is required. Delivery is awaited; a mail failure does not turn a saved enquiry into a failed submission. Provider idempotency is used for each enquiry. This small integration does not implement a durable retry queue; the separate pending outbox hardening change handles that and needs its database migrations and worker deployed. Do not enable both internal delivery paths to the same recipient without deduplication.

## Access limitation during preparation

Vercel project access returned 403 for the current connection, so production email keys/sender could not be configured and inbox delivery could not be verified. Do not mark alerts active based only on the code or a passing build.
