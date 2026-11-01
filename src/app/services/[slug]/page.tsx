import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { services, getService } from '@/data/services';
import { processSteps } from '@/data/process';
import {
  Breadcrumbs,
  Button,
  FAQ,
  FinalCTA,
  JsonLd,
  PageHero,
  SectionHeading,
  ServiceIcon,
  TextLink,
} from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
import { brand } from '@/config/brand';
import { site } from '@/config/site';
import { SectionLinks } from '@/components/reading-navigation';
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return service ? makeMetadata(service.name, service.intro, `/services/${slug}`) : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const index = services.indexOf(service);
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Services', href: '/services' },
          { label: service.name, href: `/services/${slug}` },
        ]}
      />
      <PageHero title={service.headline} description={service.intro}>
        <Button href={`/contact?service=${encodeURIComponent(service.name)}`}>
          Discuss your project
        </Button>
      </PageHero>
      <SectionLinks
        items={[
          { id: 'overview', label: 'Overview' },
          { id: 'deliverables', label: 'What we deliver' },
          { id: 'applications', label: 'Applications' },
          { id: 'delivery', label: 'How we work' },
          { id: 'questions', label: 'FAQs' },
        ]}
      />
      <div className="shell">
        <div className="service-art" aria-hidden="true">
          <span className="service-art-label">
            {['Your audience', 'Your workflow', 'Your process', 'Your application'][index]}
          </span>
          <span className="service-art-line" />
          <div className="service-art-icon">
            <ServiceIcon index={index} size={48} />
          </div>
          <span className="service-art-line" />
          <span className="service-art-label">
            {
              [
                'A clear next step',
                'A dependable system',
                'A connected operation',
                'A reliable foundation',
              ][index]
            }
          </span>
        </div>
      </div>
      <section className="content-section shell split-content" id="overview">
        <div>
          <h2>Better technology starts with a better question.</h2>
        </div>
        <div className="body-copy">
          <p className="lead">{service.problem}</p>
          <p>{service.opportunity}</p>
          <p>
            <strong className="foreground">Who it’s for.</strong> {service.audience}
          </p>
        </div>
      </section>
      <section className="section shell" id="deliverables">
        <SectionHeading title="A practical scope. A useful outcome." />
        <div className="deliverables">
          {service.deliverables.map((item, i) => (
            <article key={item.title} className="deliverable">
              <span className="mono">0{i + 1} / DELIVERABLE</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell split-content" id="applications">
        <div>
          <h2>
            Real work.
            <br />
            Clear applications.
          </h2>
        </div>
        <ul className="use-list">
          {service.uses.map((use) => (
            <li key={use}>
              <ArrowUpRight size={18} />
              {use}
            </li>
          ))}
        </ul>
      </section>
      <section className="section shell split-content">
        <div>
          <h2>
            The right tools.
            <br />
            For the right reasons.
          </h2>
          <p className="small muted" style={{ marginTop: 24 }}>
            The final stack follows your requirements, existing systems and operating budget.
          </p>
        </div>
        <div className="tech-list">
          {service.technologies.map((tech) => (
            <div key={tech.name}>
              <h3>{tech.name}</h3>
              <p>{tech.purpose}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="content-section shell" id="delivery">
        <SectionHeading title="Built together. Reviewed as we go.">
          <TextLink href="/process">See our full process</TextLink>
        </SectionHeading>
        <p className="lead section-intro">{service.engagement}</p>
        <ol className="process-preview">
          {processSteps.map((step, i) => (
            <li key={step.name}>
              <div className="process-rule">
                <span className="mono">0{i + 1}</span>
              </div>
              <h3>{step.name}</h3>
              <p>{step.output}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="content-section shell split-content">
        <div>
          <h2>A view into the approach.</h2>
        </div>
        <div className="body-copy">
          <p>
            {slug === 'web-engineering'
              ? 'This studio website combines a custom visual identity, accessible page architecture and a server-side enquiry workflow.'
              : 'The studio website is a small example of connected delivery: a public interface, validated data capture, server-side integrations and deployment configuration.'}
          </p>
          <p className="small">
            Independent studio build. It does not demonstrate a client deployment or the full scope
            of this service.
          </p>
          <TextLink href="/work/studio-website">Read the studio website case study</TextLink>
        </div>
      </section>
      <section className="section shell" id="questions">
        <SectionHeading title="A few useful answers." />
        <FAQ items={service.faqs} />
      </section>
      <FinalCTA />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.intro,
          url: `${site.url}/services/${slug}`,
          provider: { '@type': 'Organization', name: brand.name, url: site.url },
        }}
      />
    </>
  );
}
