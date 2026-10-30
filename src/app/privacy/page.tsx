import Link from 'next/link';
import { brand } from '@/config/brand';
import { PageHero } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Privacy notice',
  'How enquiry information and optional analytics are handled on this studio website.',
  '/privacy',
);
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Website information / Updated 30 October 2026"
        title="Privacy, in plain language."
        description="This notice describes the information collected by this website, why it is used, and the choices available to you."
      />
      <div className="shell">
        <div className="legal-layout prose">
          {!brand.legalName && (
            <p className="legal-note">
              <strong>Pre-launch notice.</strong> The studio’s legal operator details and privacy
              contact must be completed and this notice reviewed before public launch. {brand.name}{' '}
              is a provisional working name.
            </p>
          )}
          <h2>Who is responsible</h2>
          <p>
            {brand.legalName || brand.name} operates this website.{' '}
            {brand.address && <>Address: {brand.address}. </>}For privacy questions,{' '}
            {brand.email ? (
              <a href={`mailto:${brand.email}`}>contact {brand.email}</a>
            ) : (
              <>
                use the <Link href="/contact">project contact page</Link> once enquiries are enabled
              </>
            )}
            . No registered company status, office location or trademark registration is implied.
          </p>
          <h2>Information you choose to provide</h2>
          <p>
            The enquiry form asks for your name, email, country, service interest, project
            description, budget and expected timeline. Company name and website URL are optional. A
            consent record, submission identifier, source and creation time are stored with an
            accepted enquiry.
          </p>
          <p>
            We use this information to understand and respond to your request, discuss a potential
            engagement and keep the conversation organised. Enquiry permission is not a subscription
            to a marketing list. Please do not include passwords, payment details, health
            information or other sensitive personal data.
          </p>
          <h2>Where information goes</h2>
          <p>
            When live integrations are configured, enquiry records are stored in PostgreSQL through
            Supabase. Resend processes confirmation and notification emails. A founder notification
            includes the enquiry details. If configured, HubSpot receives your name, email, company
            and country to maintain a contact record.
          </p>
          <p>
            Cloudflare provides website hosting and may process request metadata for delivery,
            security and abuse prevention. If enabled, Sentry receives technical error information;
            the application does not intentionally attach form contents or email addresses to its
            error reports. Providers may process data in countries outside your own. The operator
            must review the selected regions, contracts and appropriate transfer arrangements before
            live collection.
          </p>
          <h2>Security and spam prevention</h2>
          <p>
            Enquiries are validated on the server. Database records are not publicly readable. Keyed
            hashes used for rate limiting are stored separately from enquiry records. Security and
            hosting systems may process request metadata such as IP addresses. No security control
            provides an absolute guarantee.
          </p>
          <h2>Optional analytics</h2>
          <p>
            If Google Analytics is configured, it loads only after you choose to allow analytics.
            Your preference is saved in your browser. You can use “Cookie settings” in the footer to
            change it. Declining analytics does not prevent browsing or submitting an enquiry.
            Without an analytics configuration, the website does not load Google Analytics.
          </p>
          <h2>Retention</h2>
          <p>
            The operating policy is to review unconverted enquiries after 180 days and remove them
            when no longer needed for the discussion, a dispute or a required record. Records
            connected to an engagement follow that engagement’s documented retention policy.
            Delivery records are removed with the related lead. Rate-limit records are intended to
            be cleared after one day. These policies require the operator’s scheduled housekeeping
            described in the repository documentation; they are not automatic deletion claims.
          </p>
          <h2>Your requests and choices</h2>
          <p>
            You can ask about the information associated with your enquiry, request a correction, or
            ask us to stop the conversation and delete information that is no longer needed.
            Applicable rights and any required retention depend on your circumstances and the
            relevant law. Use the privacy contact above to make a request. Where applicable, you may
            also raise a concern with your local data protection authority.
          </p>
          <h2>Local testing</h2>
          <p>
            A clearly labelled local testing mode saves test enquiries as files on the development
            machine. It does not contact Supabase, Resend or HubSpot. Do not use real sensitive data
            during testing. Local test files should be deleted after testing.
          </p>
          <h2>Changes to this notice</h2>
          <p>
            The date above identifies this version. Material changes to data use should be reflected
            here before the changed processing begins.
          </p>
        </div>
      </div>
    </>
  );
}
