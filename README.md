# NEXORA — Independent Digital Engineering Studio

A complete marketing website built in this repository: Next.js App Router, React, strict TypeScript, Tailwind CSS v4, local MDX, original SVG identity and a server-side enquiry pipeline. The working name and business details are provisional. No domain, trademark, client relationship or commercial result has been verified or implied.

## Run locally

Use Node **22.12+** (Node 22 LTS recommended) and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The example configuration enables **local testing only**. The form writes a UUID-named file under `.local/enquiries/`, with simulated email delivery records. It never contacts live providers in this mode. Files are ignored by Git; do not use real sensitive information. Local mode requires a loopback site URL and request host. If port 3000 is busy, stop your existing server or change both the server port and `NEXT_PUBLIC_SITE_URL`.

## What is implemented

- Homepage with custom structural N, assembled/blueprint controls, capabilities, honest selected work, studio principles, process and industries.
- Services overview and four detailed service pages.
- Industries overview, startup and small-business pages.
- Work index and one documented independent case study: this studio website, with actual desktop/mobile screenshots.
- About, process, contact, three original insight articles, privacy, terms, confirmation, explicit `/404`, unknown-route handling and error boundaries.
- Responsive navigation, keyboard interactions, reduced-motion handling, local fonts and optional analytics consent.
- Unique metadata, canonical URLs, social previews, sitemap, robots and factual Organization/WebSite/Service/Breadcrumb/Article structured data.
- Zod validation, origin checks, request-size limits, honeypot, rate limits, durable lead capture and delivery outbox.

No CrewLab, SkyTrace or monitoring-platform assets were present. Those projects are intentionally not represented as completed work.

## Structure and editing

| Location                                     | Purpose                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/config/brand.ts`                        | Name, tagline, email, founder/operator details and social links                    |
| `src/config/site.ts`                         | Public URL, indexing defaults and primary navigation                               |
| `src/data/services.ts`                       | Complete service content and FAQs                                                  |
| `src/data/industries.ts`                     | Distinct industry use cases                                                        |
| `src/lib/content.ts`                         | Typed, validated publication registry                                              |
| `content/case-studies/`, `content/insights/` | Bundled MDX bodies; no runtime filesystem or CMS needed                            |
| `src/components/`                            | Shared layout, visual patterns and small interactive components                    |
| `src/lib/integrations/`                      | Database, email, CRM, local testing and integration modes                          |
| `migrations/001_enquiries.sql`               | PostgreSQL tables, constraints, RLS, outbox trigger and rate-limit/claim functions |
| `docs/`                                      | Design, deployment, operations and QA documentation                                |

Change identity in `brand.ts`. The custom wordmark is original SVG path artwork. If the name changes, the component automatically uses the new configured text until replacement artwork is supplied. Update the artwork in `src/components/brand.tsx` and `public/brand/` for a final rebrand. Rebuild after changing public environment variables. Social links and contact email are hidden while unconfigured.

To publish an article or case study, create a local MDX module, import it into the registry and add its validated metadata. Draft entries use `published: false`; they do not appear in routes, navigation or sitemap. Project metadata supports cover/gallery, overview/problem/solution, role, architecture, stack, challenges, outcomes and optional external/GitHub URLs. Never fill unavailable evidence with invented content.

## Integrations and environment

All used variables are documented in [.env.example](.env.example). There is deliberately no unused Supabase anon key: the browser never accesses the lead database.

| Variable                     | Purpose                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | Canonical URL and exact allowed request origin; set at build and runtime    |
| `NEXT_PUBLIC_CONTACT_EMAIL`  | Optional verified public contact address                                    |
| `ENQUIRY_MODE`               | `local` for loopback testing; remove or use `production` for live operation |
| `NEXT_PUBLIC_SUPABASE_URL`   | Supabase project URL                                                        |
| `SUPABASE_SERVICE_ROLE_KEY`  | Server-only database access; never expose or prefix with NEXT_PUBLIC        |
| `RATE_LIMIT_SALT`            | Long random HMAC secret for rate-limit identifiers                          |
| `RESEND_API_KEY`             | Server-only transactional email credential                                  |
| `RESEND_FROM_EMAIL`          | Sender on your verified sending domain                                      |
| `CONTACT_NOTIFICATION_EMAIL` | Verified founder notification/receipt reply address                         |
| `HUBSPOT_ACCESS_TOKEN`       | Optional contact read/write integration                                     |
| `NEXT_PUBLIC_GA_ID`          | Optional valid `G-...` analytics ID; loads after opt-in only                |
| `SENTRY_DSN`                 | Optional server error reporting with data collection disabled/scrubbed      |

Live enquiries require the site URL, database credentials, salt, email key, sender and notification recipient. Missing configuration disables the form honestly. The production API additionally requires the configured Cloudflare rate-limiter binding and trusted Cloudflare IP header; configured live mode deliberately fails closed on plain `next start`. Use the Workers preview or deployed Worker to verify live delivery.

Supabase and Resend are integrated using their HTTP APIs, avoiding SDKs for these small operations. The database insert atomically enqueues three delivery tasks. Next.js `after()` processes them outside the response path; failures remain available for operator retry. HubSpot upserts a contact by email when configured. It is not an agency CRM product.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit
```

`npm test` includes schema and content contracts, API error handling, provider mocks, and the actual migration executed in embedded PostgreSQL through PGlite. It does not claim to validate a hosted Supabase account or deliver real emails.

Playwright runs against a production server on `http://localhost:3100`, using a loopback local-test environment. On Windows it uses the installed Google Chrome path; elsewhere install the bundled browser with `npx playwright install chromium`. Set `PLAYWRIGHT_BASE_URL` to use an already running local server. Tests cover all page routes, navigation, form errors/success/failure, local persistence, mobile menu, overflow at seven widths and axe WCAG checks. Screenshots are written to `.local/visual/`.

`npm run format` applies Prettier. The lockfile pins the installed dependency graph; the scoped glob override fixes the adapter build tool's transitive security advisory. Review it when upgrading the adapter rather than removing it blindly.

See [docs/qa.md](docs/qa.md) for measured checks and limitations. Lighthouse targets are not assumed to be achieved.

## Deployment

Use [docs/deployment.md](docs/deployment.md) for Cloudflare Workers/OpenNext setup, migration, secrets, staging verification and rollback. Use [docs/operations.md](docs/operations.md) for delivery retry, retention and ownership. Deployment has **not** been performed as part of the repository implementation.

Before public launch, supply the real operator identity and privacy contact, review legal content, confirm brand/domain rights, configure real accounts and verify the entire live enquiry flow. No external account or domain is invented in the source.
