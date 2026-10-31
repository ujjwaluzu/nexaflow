import { EnquiryForm } from '@/components/enquiry-form';
import { PageHero } from '@/components/ui';
import { enquiryMode } from '@/lib/integrations/config';
import { metadata as makeMetadata } from '@/lib/seo';
import { brand } from '@/config/brand';
export const dynamic = 'force-dynamic';
export const metadata = makeMetadata(
  'Start a project',
  'Tell us about your website, software or automation project. Share your goals, budget and timeline to start a practical conversation.',
  '/contact',
);
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      <PageHero
        title="What are you working on?"
        description="A new idea, a system that needs improving, or a process that takes too much time. Tell us where you want to go."
      />
      <section className="shell contact-layout">
        <aside className="contact-aside">
          <div>
            <h2>A little context goes a long way.</h2>
            <p>
              You don’t need a technical specification. Start with the business goal and what a
              useful outcome would look like.
            </p>
            <p>
              You’ll communicate directly with the engineer. We’ll review the context and work out
              whether there’s a sensible next step.
            </p>
            {brand.email && (
              <a className="text-link" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            )}
          </div>
          <div>
            <ol>
              <li>
                <span className="mono">01</span>Your enquiry is securely recorded.
              </li>
              <li>
                <span className="mono">02</span>We review the goals and fit.
              </li>
              <li>
                <span className="mono">03</span>We discuss scope, approach and next steps.
              </li>
            </ol>
          </div>
        </aside>
        <EnquiryForm mode={enquiryMode()} initialService={service} />
      </section>
    </>
  );
}
