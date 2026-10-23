# AutoAppel / AppealMyTickets audit

Date: 2026-10-23

> Historical audit findings: subsequent repairs are documented in `FIXES_AND_RELEASE.md`. The findings below describe the pre-repair state, not the current branch. Production remains unchanged until release.

## Verdict

**Not ready to certify as working correctly for paying customers.** The checkout, submission persistence, authorization and payment-verification issues below are release blockers. Public page HTTP responses alone do not establish that the customer journey works.

## Scope and evidence

Reviewed application routes, middleware, database schema/migration, auth helpers, intake, payment, notifications and deployment configuration. Installed dependencies, ran production builds, TypeScript, npm audit, lint command, and local production HTTP smoke tests. Inspected read-only Vercel deployment metadata/logs and GitHub run statuses.

No production settings changed. No real payments, email/SMS sends, account creation, or production personal-data retrieval performed. No authenticated end-to-end/browser/mobile accessibility or visual tests completed. Local Supabase credentials were absent; live database policies and external provider behavior were not verified. Findings about deployed code require checking against the actual production commit.

### Deployment evidence

Vercel project `autoappel` owns verified `www.appealmytickets.com`; apex redirects to www with 308. The latest production attempt for repository commit `219829e` is ERROR. The last successful production deployment in the returned history was `dpl_4J1H9mFDdEQMteuRrLkHomdfSr75`, commit `abfa7f2`, September 25, 2026 (UTC). Therefore current repository code is not what the last successful production deployment built. The recent preview build log confirms the same Tailwind/PostCSS failure reproduced locally. A second project, `jasonmanuel-cmd-autoappel`, also has a failed production attempt.

GitHub recent CI/CodeQL runs are failing; logs could not be retrieved through the sandbox network. Workflow source also suppresses build/security/lint exit codes, so even a completed runner would not reliably enforce quality.

## Critical/high findings — not fixed by this audit

| Priority | Finding and evidence | Required action |
|---|---|---|
| Critical | `GET /api/contact` has no authentication and returns `serverStore.getContacts()` using server privileges. Local unauthenticated request returned 200 (empty local store). | Require verified admin authorization; add negative tests. Do not expose message lists publicly. |
| Critical | `GET /api/citations` accepts any authenticated user, or a caller-controlled `demo_mode=true` cookie, then reads all citations/stats through the service-role store. Detail GET/PATCH require login but no ownership/admin checks. | Remove cookie bypass; scope customer reads to immutable user ID and require admin authorization for cross-customer reads/status changes. |
| Critical | `generate-strategy` accepts any logged-in caller's citation ID, does not verify ownership/payment, generates/sends the PDF and then marks the citation paid. The success page invokes it from query parameters. No Square payment-verification/webhook route exists in the repository. | Verify completed provider payment server-side, bind order/citation/user/price, enforce ownership, and make fulfillment idempotent. Never treat a redirect/query parameter as proof of payment. |
| Critical | `supabase-schema.sql` lets all authenticated users read/update all citations and grants all authenticated users full access to treasury, audit and other admin tables. Middleware only checks login, not an admin role, and omits `/admin/citations/*` entirely. | Implement trusted server-controlled admin roles and owner-scoped RLS; review actual deployed policies and apply a migration. Middleware alone cannot secure direct database access. |
| High | Checkout rejects normal production Origin `https://www.appealmytickets.com`: allowlist only checks for substrings `autoappel` or `localhost`. It then uses `createServerSupabase().auth.getUser()` on a non-cookie-aware service client, which has no request session. Validate-promo and payment/process have the same auth-client mismatch. | Use a request-scoped SSR auth client, exact trusted origin comparison, and separate privileged DB access. Test signed-in checkout at the canonical domain. |
| High | Checkout trusts client-supplied `plan` and `amount`; schema only requires amount >= 1. Promo use count and redemption are separate operations and DB errors are ignored. | Derive prices from a server catalog, verify citation ownership and redeem promotions atomically with durable limits. |
| High | Intake stores a locally generated citation ID, ignores the server response/status and navigates to payment with the local ID. Server insertion generates its own ID. Failed submissions can look successful; browser and server records diverge. | Await successful durable insertion, use returned ID consistently, display failures and retain retry state. |
| High | `server-store.ts` silently falls back to process memory after database insertion failures, returning success. Serverless instance turnover loses these records; later reads can query the DB rather than fallback memory. | Fail closed in production on persistence errors; restrict mock storage to explicit development mode. |
| High | Turnstile verification secret is hardcoded in `lib/turnstile.ts` in a public repository. Vercel variable names returned by the connector did not include a Turnstile secret or CRON_SECRET. | Rotate the exposed secret at the provider, move it to a server-only environment variable, redeploy and verify. Removing it from current source alone is insufficient. |
| High | Reminder cron checks its bearer token only when CRON_SECRET exists. Without it, anyone can trigger messages and receive recipient details. SMS loop does not honor preferred_contact and has no send ledger/idempotency. | Require secret unconditionally, avoid recipient PII in responses, respect consent/preferences and deduplicate sends. |
| High | `/api/payment/process` accepts raw card details but has no real payment-provider implementation; it can claim success after only recording a submission if auth were repaired. | Disable/remove legacy card form and endpoint; use provider-hosted checkout/tokenization exclusively. |
| High | Signup side-effect API accepts arbitrary email without authentication/rate limiting; notification APIs allow any logged-in user to supply recipients and notification content/verification URL. | Trigger messages from trusted server events, enforce recipient ownership/admin role and abuse controls. |

## Other functional/quality issues

- Payment success UI can show a paid claim without a verified transaction. Its strategy effect retries on errors because `generating` returns to false while `generated` remains false, potentially repeatedly sending requests.
- `service_fee_status` and `promo_code` used by UI/payment code are not defined in the checked-in base schema or migration. Verify live schema and add a versioned migration.
- Operational control panels rely extensively on browser localStorage (`lib/store.ts`), not authoritative shared operational state. These controls should not be represented as real security/shutdown/banking controls without backend enforcement.
- `use-auth.ts` trusts localStorage `aa_admin_auth` and demo mode for UI authentication; this must never be an authorization boundary.
- Health endpoint reports configured environment variables, not actual dependency health.
- Production CSP permits Cloudflare frames but not its script origin, so Turnstile loading can be blocked. Test a real widget under production headers.
- API CORS origin is `https://AppealMyTickets.com`, not canonical lowercase www. Same-origin requests do not need CORS; any intended cross-origin behavior needs deliberate configuration.
- `npm run lint` fails: Next 16 removed `next lint`. No working ESLint setup was present. CI masks failures with `|| true`; CodeQL uses an incorrect initialization action (`actions/setup-codeql@v3` instead of `github/codeql-action/init`).
- Playwright spec used Page objects with locator-only text matchers. Corrected those assertions, but selectors/test flows still need a real authenticated browser run and provider mocks.
- No local Supabase credentials: `/dashboard` and `/api/citations` return 500 rather than a graceful unavailable/auth response. This is a local missing-configuration result, not proof that configured production returns 500.
- `/admin/citations/test` returns 200 without middleware protection; that is a page shell, not evidence that data loaded. Direct data access still needs proper RLS.
- Next reports middleware convention deprecation; migrate to proxy in a separate tested change.

## Changes made on this branch

Only build/tooling compatibility and a narrow dependency fix were made; the security/customer-flow blockers above remain open.

1. Installed `@tailwindcss/postcss` and updated PostCSS and CSS entry directives for Tailwind v4, explicitly loading the existing theme config. Visual regression checks remain necessary after the v4 upgrade.
2. Removed TypeScript 7's unsupported `downlevelIteration`; accepted Next's required JSX/target/generated-type configuration.
3. Updated dynamic citation API route params to awaited Promises for Next 16.
4. Initialized Resend inside email sending after checking configuration, so missing email credentials no longer crash build-time route evaluation.
5. Corrected Playwright text matchers to target the body locator; retained e2e files in TypeScript checking.
6. Updated vulnerable transitive `follow-redirects`; npm audit now reports zero known vulnerabilities in the installed dependency tree.
7. Ignored TypeScript incremental cache artifacts.

## Final checks

- `npm run build`: PASS; 39 static pages generated, dynamic routes compiled.
- `npx tsc --noEmit`: PASS, including checked-in e2e specs.
- `npm audit`: PASS, zero reported vulnerabilities (not a security certification).
- `git diff --check`: PASS.
- `npm run lint`: FAIL, existing obsolete command; not repaired here.
- Local production HTTP smoke: 200 for `/`, `/login`, `/intake`, `/contact`, `/faq`, `/privacy`, `/terms`, `/forgot-password`, `/payment/service`, `/payment/success`, `/track`, `/robots.txt`, `/sitemap.xml`, `/api/health`.
- Negative checks: unauthenticated `/api/contact` returned 200; `/admin/citations/test` returned 200; missing-env `/dashboard` and `/api/citations` returned 500.

## Recommended repair order

1. Immediately restrict public/cross-customer data APIs, remove demo bypasses, rotate Turnstile secret, and secure cron.
2. Implement admin roles and owner-scoped database policies, then test anonymous/customer/admin access matrices.
3. Repair intake durable IDs and failure handling.
4. Rebuild payment lifecycle around authenticated checkout, authoritative prices, verified provider payment and idempotent fulfillment; remove raw-card legacy flow.
5. Add isolated browser/API regression tests and enforce build/typecheck/security checks in CI.
6. Deploy a preview, run mobile/desktop visual, keyboard/accessibility, password reset, upload, email/SMS and sandbox-payment tests; only then approve production deployment.
