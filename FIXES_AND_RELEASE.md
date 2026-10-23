# Repairs and release checklist

Updated October 23, 2026. These changes are saved on the Arena working branch. **No production deployment, secret rotation, database migration, real charge or real notification send has been performed.** Older “deployment ready” documents and `SITE_AUDIT.md` describe earlier states; this document is the current release guide.

## Implemented

### Authorization and persistence
- Every customer API citation lookup checks immutable `user_id`; list queries are owner-scoped. Only trusted `app_metadata.role=admin` grants cross-customer/admin access. Demo cookies and localStorage cannot grant production access.
- Proxy protects all `/admin/*` routes except login and checks admin roles. Missing auth configuration redirects safely rather than crashing. API errors return controlled statuses and private/no-store headers; refreshed auth cookies are preserved.
- New migration replaces permissive policies, adds owner linkage, locks down admin tables and payment writes, and protects submission rows and the known dashboard view. The base schema no longer installs the old permissive policies.
- Citation intake uses the ID returned by a successful database insert. Database errors never return mock persistence success. Tracking, confirmation, checkout and dashboards read server records, not browser-only citation lists.
- Public contact-list access is closed. Contact form errors preserve the message and show failure; challenge tokens reset after each attempt.
- Support requests use an ownership-checked server endpoint, generate trusted receipt notifications and appear in citation detail pages. UI makes clear these requests are not court filings.

### Checkout, verification and delivery
- Square hosted checkout is the only payment collection path. Legacy raw-card form was removed; old processing endpoint returns 410 without reading card data. Court fines must be paid directly to the court.
- Server-defined service price is $79.99 USD regardless of client `amount`. Exact configured origin replaces substring matching. Request-scoped Supabase auth replaces the sessionless service-client auth check.
- Durable checkout reservation serializes attempts and reuses a stable Square idempotency key/link. Promo redemption is a service-only SQL transaction, capped at five uses, repeat-safe, and disallowed once a normal checkout has been reserved (support can cancel an abandoned attempt).
- Fulfillment requires a stored order linked to the citation and provider-confirmed COMPLETED payment, matching order/location/currency/exact price and no refunds, or a recorded atomic free-promo grant. Browser query parameters cannot mark anything paid.
- Signed Square webhook and authenticated return page share the same fulfillment logic. Webhook signature uses the exact configured notification URL and raw body. Non-completed events are acknowledged without delivery.
- Document sends have a durable atomic claim and stable Resend idempotency key. Repeated completed requests return success without sending another email. Failed delivery is visible and retryable without another charge. PDF attachments are explicitly base64 encoded.
- Checkout fails closed when email delivery or webhook configuration is absent. Service-fee payment does not claim the customer's court fine is paid/resolved.

### Other fixes
- Turnstile secret is no longer in source; verification fails closed and checks the configured hostname. Site key is configured per environment. Production CSP permits Cloudflare's script/frame origins and removes unsafe-eval.
- Reminder cron requires its secret unconditionally, honors channel preferences, claims a durable per-citation/deadline/channel/day ledger entry, and returns counts rather than recipient PII. Provider failures are counted rather than called successful.
- Disabled user-controlled notification/CRM/signup side-effect endpoints (410). Supabase handles signup verification; trusted citation/submission workflows send transactional receipts. Arbitrary logged-in users cannot send messages to third parties.
- Supabase PKCE callback exchanges the code and writes session cookies. Signup, resend and password recovery use it; password reset checks a real authenticated session instead of trusting a URL token flag.
- Urgency no longer declares a deadline expired three days early. Missing deadlines are treated cautiously; dashboards calculate urgency from current time rather than stale stored risk.
- Local-only operational panels are explicitly labeled simulations, not production security, treasury or deployment controls. Demo state is disabled in production.
- Connected form labels, improved text/button contrast, removed opacity that harmed contrast, and honored reduced-motion preferences. Canonical URLs use www; sitemap omits private/transactional screens.
- Repaired Next 16/Tailwind 4 build configuration, dynamic params, lazy provider initialization and standalone asset startup. TypeScript uses a maintained version compatible with the ESLint parser. ESLint/typecheck/tests/build/audit now fail CI on errors rather than masking failures. CodeQL initialization is repaired. Dependabot groups only compatible minor/patch changes.

## Verification

Executed locally with no live provider credentials:

| Check | Result |
|---|---|
| `npm run build` | Pass |
| `npm run typecheck` | Pass, including tests |
| `npm run lint` | Pass (errors enforced; existing unused-variable warnings are non-blocking) |
| `npm test` | 8 passing suites/tests |
| `npm run test:e2e` | 10 passing desktop/mobile browser tests |
| `npm audit` | Zero reported vulnerabilities |
| `git diff --check` | Pass |

The API regression test mocks all external fetches and exercises cross-customer access denial, forged admin metadata, demo-cookie bypass denial, authoritative checkout price, missing/unverified payment rejection, real PDF generation with mocked mail delivery, repeated delivery, and valid/invalid webhook signatures. The PostgreSQL test executes the schema and migration in PGlite (with Supabase auth functions/roles simulated) and verifies customer/admin/anonymous RLS, service-only payment writes, checkout reservation, repeat-safe promo redemption and exhaustion. This is not a substitute for running against the actual hosted schema.

Browser tests cover public rendering/width on desktop and mobile, no false payment success or uncontrolled retry loop, removal of card collection, controlled missing-config behavior, and automated serious/critical WCAG A/AA findings on home/login/contact/password recovery/FAQ/privacy/terms. External browser services are blocked/mocked. The old `autoappel.spec.ts` and `mobile-qa.spec.ts` are legacy reference tests, not the release regression suite; `playwright.config.ts` explicitly selects `regression.spec.ts`.

## Required production steps — do not skip

1. **Back up and inspect the database.** Test against a staging clone first. For a new installation run `supabase-schema.sql`, then versioned migrations in chronological order. For an existing installation apply only unapplied migrations, including `supabase/migrations/202610230001_security_payments.sql`. Never rerun the base schema on a live installation.
   - Review historical email ownership before the migration's verified-email backfill. Unmatched citations remain admin-only.
   - Inspect actual existing table columns, constraints, grants, exposed views/functions and storage policies. The migration fixes known tables/view, not unrelated objects created outside this repository.
   - Historical “paid” flags are **not automatically trusted as provider payments**. Reconcile genuine historical payments with receipts before migrating those cases into the new ledger; do not blindly copy flags.
2. **Assign administrator roles deliberately.** Using the Supabase Admin API or trusted SQL console, set `app_metadata.role` to `admin` only for verified staff accounts, preserving other metadata. Never use user-editable metadata. Reauthenticate afterward so JWT claims/RLS match. Ordinary accounts cannot access the admin area after this change.
3. **Rotate the exposed Cloudflare secret** in Cloudflare and set `TURNSTILE_SECRET_KEY`. Set the matching `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; register the exact environment hostname. The old secret remains compromised in Git history even though removed from current source.
4. **Configure secrets through the hosting provider**, never chat or source control. Use `.env.example` as a name reference:
   - Supabase URL/anon key and server-only service-role key, for the same project.
   - `NEXT_PUBLIC_APP_URL=https://www.appealmytickets.com` for production. Use separate, exact URLs/secrets/hostnames for previews and localhost; do not share production customer data with sandbox tests.
   - Verified `EMAIL_FROM`, `RESEND_API_KEY`; valid Twilio credentials/number if SMS is enabled.
   - Random `CRON_SECRET` and a cron integration that sends `Authorization: Bearer <secret>`. Do not override NODE_ENV manually.
   - Square environment (`sandbox` or `production`), location and access token. Subscribe to `payment.created` and `payment.updated` at `/api/payment/webhook`. Set `SQUARE_WEBHOOK_SIGNATURE_KEY` and **exact** `SQUARE_WEBHOOK_URL` as registered with Square (scheme, host, path and slash must match).
   - Public variables are baked into the client build: rebuild after changing them.
5. **Test real integrations in staging:** signup/verification, recovery email/callback, two distinct customer accounts plus admin/anonymous RLS, contact delivery persistence, intake ID, consent preferences, actual Turnstile, Square sandbox checkout/promo/exhaustion, forged redirect, signed webhook retries, PDF in the inbox, reminder deduplication. Check your provider dashboards and actual DB records, not just a success screen.
6. Deploy a reviewed preview, repeat the checks, then release production. Configure monitoring for degraded `/api/health`, webhook non-2xx, stuck fulfillment and failed reminder ledger entries. Set branch protection to require CI/CodeQL.

## Operational boundaries / recovery

- Process-local rate limits are best-effort, not a distributed abuse-control system. Use hosting WAF/rate controls for multi-instance production; Turnstile and provider-side auth throttles remain necessary.
- Resend idempotency has a finite provider window. Claims stuck over five minutes are retryable; review long-delayed/uncertain sends in the provider dashboard before retrying outside its idempotency window. No email/SMS system can guarantee exactly-once delivery across all network failures. Reminder failures/uncertain claimed entries require operational review rather than blind repeated sends.
- An abandoned Square checkout cannot be turned into a free promo automatically: support must deactivate the Square payment link and reconcile payments before removing the pending reservation. This intentionally favors avoiding double charges over convenience.
- Treasury, ambassador activation, Red Vault and founder/deployment controls remain **prototypes**, now explicitly labeled. This repair does not invent real banking verification, biometric security or deployment shutdown integrations.
- This is not a legal-content audit, PCI certification, or guarantee of court outcomes. Strategy documents and court/deadline guidance still require appropriate business/legal review. Human keyboard/screen-reader testing, full provider testing and review of the actual deployed database remain release requirements.
