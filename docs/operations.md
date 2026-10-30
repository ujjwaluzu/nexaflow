# Enquiry operations

## Data flow

The browser validates the form, then sends JSON to `POST /api/enquiries`. The server verifies origin, body size, schema and consent. Cloudflare applies a per-IP limit of 10/minute; PostgreSQL atomically enforces five accepted attempts per email hash per ten minutes. The HMAC salt remains server-side. Limits use different windows for different purposes; the native Cloudflare limiter is distributed according to Cloudflare's own rate-limit semantics, while the database check is shared globally.

The client keeps one UUID for retries during the form session. PostgreSQL ignores duplicate IDs without overwriting the accepted record. The insert trigger creates client email, founder email and CRM delivery tasks in the same transaction. The response confirms persistence. `after()` starts delivery; failed jobs stay durable. There is no public lead-list or retry/admin endpoint.

The honeypot, size checks, strict schema and layered limits reduce basic abuse; they are not a proof against all automated submissions. If actual abuse warrants it, add a server-verified challenge or Cloudflare WAF rule based on evidence. The initial build does not introduce a fake CAPTCHA.

## Retry delivery

Use a trusted machine/CI runner with the documented server variables. Run:

```text
npm run retry:deliveries
```

The command loads `.env.local`, reclaims processing jobs abandoned for over 15 minutes and processes up to 50 pending/failed jobs. It prints task counts, never lead data or secrets. Claims are atomic, with a 20-attempt ceiling. Schedule this command on a trusted runner every few minutes; the repository does not claim a scheduler has been provisioned. Monitor failed, needs_review and old pending jobs from a private database/dashboard connection. Monitor the command's exit status.

Resend delivery uses a stable task UUID as its idempotency key. [Resend retains keys for 24 hours](https://resend.com/changelog/idempotency-keys). Email retries with an earlier attempt and a task older than 23 hours move to `needs_review`. Reconcile the provider's delivery logs before resetting a job, avoiding a blind duplicate send after that window. No email provider can make our database update and its delivery one cross-provider transaction.

HubSpot uses email-based upsert. If no token exists at processing time, CRM is marked skipped. Enabling it later does not silently replay historical contacts; review consent and select the records deliberately if a backfill is needed. Never log full enquiry payloads during debugging.

## Retention and deletion

Assign an operator to review unconverted leads after 180 days, deleting those no longer necessary for a conversation, required record or dispute. Adopt a separate written retention policy for contracted clients. Remove corresponding records in Resend/notification mailboxes/HubSpot according to that policy and applicable duties; deleting PostgreSQL alone cannot delete provider-held copies.

Run this daily on a trusted database connection to clear expired limiter buckets:

```sql
delete from public.enquiry_rate_limits where window_start < now() - interval '1 day';
```

No automated lead-deletion schedule is claimed. Review records privately, then delete by explicit ID through an authorised database connection. Cascading deletes remove associated outbox tasks. Review backup retention and restore access too. Delete disposable local test files under `.local/enquiries` after testing; the directory is never deployed or committed.

## Credentials, support and monitoring

Keep service credentials in server secrets. Rotate them through the provider/Cloudflare controls if compromised. Apply least privilege to human operators; Supabase service-role access is powerful and must remain restricted to this backend and trusted maintenance tools. Consider a scoped database role for a broader backend as the business grows.

Sentry is optional and server-only. SDK v11's data collection categories are explicitly disabled, automatic integrations are disabled, and captured pipeline errors use fixed codes instead of provider response bodies. Request/user/breadcrumb/extra data is removed before sending. See [Sentry's v11 changes](https://sentry.io/changelog/javascript-sdk-v11/) when upgrading. No client replay, profiling or form-data capture is enabled.

GA is optional and opt-in. Its code is not loaded before permission, decline is equally available, and consent can be revisited from the footer. Browser preference storage is functional site storage. Review your actual analytics settings and provider retention before enabling.

The Content Security Policy allows inline scripts for Next hydration and JSON-LD. It blocks objects, framing and foreign form submissions and constrains remote origins. A nonce-based policy would require a dynamic rendering tradeoff and is not claimed here. Static security headers are configured in Next; verify them on Workers after deploying.
