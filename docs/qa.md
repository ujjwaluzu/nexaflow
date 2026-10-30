# Verification record

Date: 30 October 2026. Windows workspace, Node 22.18.0, local installed Chrome. No external business accounts or production secrets were provided.

## Executed checks

| Check                      | Result                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strict TypeScript          | Passed                                                                                                                                                    |
| ESLint                     | Passed; generated/vendored artifacts excluded                                                                                                             |
| Unit/integration tests     | 40 passed across 6 files                                                                                                                                  |
| PostgreSQL migration       | Executed in PGlite: lead/outbox transaction, rate limit, single claims, constraints, anon/authenticated access rejection and cascading deletion passed    |
| Provider integration tests | Mocked Supabase REST, Resend idempotency/failure, optional HubSpot upsert, failed-task persistence and expired-idempotency review passed                  |
| Production browser suite   | 19 passed, 1 intentionally skipped desktop instance of the mobile-only menu test                                                                          |
| Route coverage             | All 21 public content/confirmation paths returned 200; `/404` and an unknown path returned 404                                                            |
| Enquiry flow               | Browser validation, server validation, local file persistence, simulated notifications and confirmation passed on desktop/mobile; failure preserves input |
| Automated accessibility    | No axe WCAG A/AA/2.1 AA violations on homepage, contact, web service, case study and privacy in desktop/mobile Chromium                                   |
| Responsive overflow        | No horizontal overflow at 360, 390, 430, 768, 1024, 1440 and 1720 px on homepage, contact, software service and case study                                |
| Visual review              | Desktop/mobile screenshots reviewed; custom graphic reframed after discovering a clipped baseplate; project media replaced with actual site captures      |
| Media loading              | Additional desktop/mobile capture tests scrolled to lazy media and verified nonzero image dimensions                                                      |
| Next production build      | Passed as part of OpenNext build                                                                                                                          |
| OpenNext Worker build      | Passed; generated `.open-next/worker.js`                                                                                                                  |
| Wrangler packaging dry run | Passed with native limiter, self-reference and ASSETS bindings; minified gzip approximately 2.7 MiB                                                       |
| Dependency audit           | Zero reported vulnerabilities after a scoped transitive glob override                                                                                     |

The full production browser suite ran against `next start` on port 3100, with explicit local-test mode. A later targeted media capture used the existing development preview on port 3000. The portfolio assets were generated from the production hero captures, not invented interfaces. The full-page capture test now scrolls lazy media into view before capturing to avoid blank screenshot regions.

## Verification limits

- No real Supabase project, Resend sender/recipient, HubSpot account, GA property or Sentry project was used. HTTP contracts are tested with mocks; local end-to-end delivery is explicitly simulated. The migration mechanics were tested in PostgreSQL, not a hosted Supabase account.
- Worker bundle generation and packaging are verified. No Worker was deployed and no live Workers enquiry was sent. Check headers, after-response delivery, service bindings and live provider behaviour in staging before launch.
- No Lighthouse scores are claimed. Automatic approval review blocked a separate production-server launch for a Lighthouse run without supplying a more specific reason. The existing production E2E results are independent of that blocked action.
- Automated axe checks complement keyboard and layout checks; they are not a full screen-reader or accessibility conformance certification. Safari/WebKit, Firefox, actual phones and real network conditions have not been tested.
- Windows produced OpenNext's standard compatibility warning despite a successful build. Linux/WSL CI is recommended for repeatable release builds.

## Required activation work

Configure the owned domain, operator identity and verified public contact. Review the legal notices and actual data regions/contracts. Apply the migration, configure secrets and the native rate-limiter binding, verify the sending domain and controlled recipients, and run one real staging enquiry through database, email and optional CRM. Assign delivery retry, retention, alerting, backup and dependency-maintenance ownership. Rebuild with the real URL before allowing indexing.
