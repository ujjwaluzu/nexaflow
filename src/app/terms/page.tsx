import Link from 'next/link';
import { brand } from '@/config/brand';
import { PageHero } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Website terms',
  'Terms for using this studio website and making an initial project enquiry.',
  '/terms',
);
export default function TermsPage() {
  return (
    <>
      <PageHero
        title="A clear starting point."
        description="These terms concern the use of this website. Any paid project will have its own written agreement, scope and commercial terms."
      />
      <div className="shell">
        <div className="legal-layout prose">
          {!brand.legalName && (
            <p className="legal-note">
              <strong>Pre-launch terms.</strong> Operator identity, applicable jurisdiction and the
              final commercial terms require confirmation and legal review before public launch.{' '}
              {brand.name} is a provisional working name.
            </p>
          )}
          <h2>About this website</h2>
          <p>
            This website introduces {brand.name}, an independent digital engineering and automation
            studio. Service descriptions explain potential capabilities and engagement approaches.
            They do not constitute a fixed offer, guaranteed outcome or promise that a particular
            project can be accepted.
          </p>
          <h2>Project enquiries</h2>
          <p>
            Submitting an enquiry starts a conversation. It does not book a project, reserve
            availability or form a paid services agreement. Budget ranges are planning information,
            not published prices or quotations. Any engagement requires an agreed scope, fees,
            schedule, responsibilities and written acceptance.
          </p>
          <h2>Information and accuracy</h2>
          <p>
            We aim to keep the content useful and accurate, but technical content can become
            outdated. Articles are general engineering perspectives and should be considered in the
            context of your own systems and requirements. No business growth, search ranking,
            revenue, security or uptime result is guaranteed by this website.
          </p>
          <h2>Work and attribution</h2>
          <p>
            Projects are labelled according to their documented context. Independent work must not
            be interpreted as a paid client engagement. Unless stated otherwise, commercial outcomes
            have not been measured. Third-party tools and names remain associated with their
            respective owners; their mention does not imply endorsement or partnership.
          </p>
          <h2>Intellectual property</h2>
          <p>
            Website content and original brand assets are provided for viewing and evaluating the
            studio. Third-party fonts, icons and software retain their licences. Ownership and
            licensing of deliverables for a paid project will be set out in its agreement. This
            website makes no claim that the working name has been registered or cleared for use.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Do not use the enquiry form for spam, impersonation, malicious submissions or content
            you have no right to share. Do not attempt to access private records, bypass security
            controls or disrupt availability. Security testing should be arranged with the operator
            in advance.
          </p>
          <h2>External services and availability</h2>
          <p>
            Linked services have their own terms and privacy practices. The website may be
            unavailable during maintenance or provider interruptions. The enquiry interface will
            report when it cannot save a submission; a saved enquiry and a delivered email are
            separate events.
          </p>
          <h2>Project-specific terms</h2>
          <p>
            Payment, cancellation, acceptance, support windows, ownership, liability and dispute
            arrangements belong in a separate project agreement. These website terms do not replace
            that agreement or override rights that cannot lawfully be excluded.
          </p>
          <h2>Contact</h2>
          <p>
            For questions about these terms, use the <Link href="/contact">contact page</Link>
            {brand.email && (
              <>
                {' '}
                or email <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </>
            )}
            . Please also read the <Link href="/privacy">privacy notice</Link> before sending
            information.
          </p>
        </div>
      </div>
    </>
  );
}
