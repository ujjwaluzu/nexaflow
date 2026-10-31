import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { services } from '@/data/services';
import { processSteps } from '@/data/process';
import { brand } from '@/config/brand';
import { Button, SectionHeading, ServiceIcon, TextLink, EmptyProjectNote } from './ui';
export function Capabilities() {
  return (
    <section className="section shell home-capabilities" id="capabilities" data-reveal>
      <SectionHeading title="Everything your business needs to operate digitally.">
        <p>
          Four connected disciplines.
          <br />
          One considered approach.
        </p>
      </SectionHeading>
      <div className="capability-list">
        {services.map((service, index) => (
          <Link className="capability-row" href={`/services/${service.slug}`} key={service.slug}>
            <span className="mono capability-number">{service.number}</span>
            <div className="capability-symbol">
              <ServiceIcon index={index} />
            </div>
            <h3>{service.name}</h3>
            <p>{service.short}</p>
            <ArrowUpRight size={24} className="row-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
export function SelectedWork({
  full = false,
  editorial = false,
}: {
  full?: boolean;
  editorial?: boolean;
}) {
  if (editorial) {
    return (
      <section className="section shell home-work" id="work" data-reveal>
        <div className="home-work-grid">
          <div>
            <h2>Built with purpose. Engineered to perform.</h2>
            <div className="home-project-info">
              <h3>
                <Link href="/work/studio-website">{brand.name} / The studio website</Link>
              </h3>
              <p>
                A considered digital home for an independent engineering practice. Brand, design,
                content and a connected enquiry system.
              </p>
              <p className="mono">Next.js / TypeScript / PostgreSQL</p>
              <EmptyProjectNote />
              <Button href="/work/studio-website">Read the case study</Button>
              <TextLink href="/work">Explore our work</TextLink>
            </div>
          </div>
          <Link
            className="home-work-art"
            href="/work/studio-website"
            aria-label={`View the ${brand.name} studio website case study`}
          >
            <Image
              src="/art/mech-halftone-transparent.webp"
              width={730}
              height={919}
              alt="Black-and-cream halftone sticker of a mechanical hand holding a small globe"
              sizes="(max-width: 900px) 100vw, 50vw"
              loading="lazy"
            />
          </Link>
        </div>
      </section>
    );
  }
  return (
    <section className={`section shell ${full ? 'work-section-full' : ''}`}>
      {!full && (
        <SectionHeading title="Built with purpose. Engineered to perform.">
          <TextLink href="/work">Explore our work</TextLink>
        </SectionHeading>
      )}
      <article className="project-feature">
        <Link
          href="/work/studio-website"
          className="project-visual"
          aria-label={`View the ${brand.name} studio website case study`}
        >
          <div className="project-browser">
            <div className="browser-bar">
              <span />
              <span />
              <span />
              <span className="browser-caption">THE STUDIO / INDEPENDENT BUILD</span>
            </div>
            <Image
              src="/projects/studio-cover.webp"
              width={1400}
              height={875}
              alt="Actual homepage of this studio website, with editorial typography and the structural N illustration"
              className="project-screenshot"
            />
          </div>
          <span className="project-view">
            <ArrowUpRight size={25} />
          </span>
        </Link>
        <div className="project-info">
          <div>
            <h3>
              <Link href="/work/studio-website">{brand.name} / The studio website</Link>
            </h3>
            <p>
              A considered digital home for an independent engineering practice. Brand, design,
              content and a connected enquiry system.
            </p>
          </div>
          <div className="project-meta">
            <span>Next.js / TypeScript / PostgreSQL</span>
            <TextLink href="/work/studio-website">Read the case study</TextLink>
          </div>
        </div>
      </article>
      <EmptyProjectNote />
    </section>
  );
}
export function WhyStudio() {
  const reasons = [
    'Built around your business requirements',
    'Direct communication with the engineer',
    'Connected web, software and automation',
    'Maintainable code and clear documentation',
    'A foundation for a long-term partnership',
  ];
  return (
    <section className="section home-statement" id="about" data-reveal>
      <div className="shell">
        <div className="home-statement-grid">
          <span className="statement-word" aria-hidden="true">
            We
          </span>
          <div className="statement-copy">
            <Image
              className="brain-sticker"
              src="/art/brain-transparent.webp"
              width={820}
              height={820}
              alt="Halftone brain sticker"
              sizes="(max-width: 600px) 80vw, 340px"
              loading="lazy"
            />
            <h2>
              One engineering partner.
              <br />
              <span className="muted">Connected solutions.</span>
            </h2>
            <p className="lead">
              Your website, software and operations shouldn’t feel like separate conversations.
            </p>
            <p>
              At {brand.name}, design decisions and technical decisions happen together. You work
              directly with the person building your system, with a clear scope and a practical view
              of what comes next.
            </p>
            <TextLink href="/about">Meet the approach</TextLink>
          </div>
          <span className="statement-word" aria-hidden="true">
            Build
          </span>
        </div>
        <ul className="reasons">
          {reasons.map((reason) => (
            <li key={reason}>
              <Check size={16} />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export function ProcessPreview() {
  return (
    <section className="section home-process" id="path" data-reveal>
      <div className="shell">
        <SectionHeading title="A clear path from idea to production.">
          <TextLink href="/process">Inside the process</TextLink>
        </SectionHeading>
        <ol className="process-preview">
          {processSteps.map((step, index) => (
            <li key={step.name}>
              <div className="process-rule">
                <span className="mono">0{index + 1}</span>
                <Plus size={14} />
              </div>
              <h3>{step.name}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
export function IndustriesPreview() {
  const items = [
    {
      name: 'Startups',
      href: '/industries/startups',
      text: 'From a clear idea to a focused first release.',
    },
    {
      name: 'Small businesses',
      href: '/industries/small-business',
      text: 'Better websites. Fewer manual workarounds.',
    },
  ];
  return (
    <section className="section shell industries-preview" data-reveal>
      <SectionHeading title="Different businesses. Real-world challenges.">
        <p>
          Technology shaped to the work.
          <br />
          Never the other way around.
        </p>
      </SectionHeading>
      <div className="industry-links">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <h3>{item.name}</h3>
            <p>{item.text}</p>
            <ArrowUpRight size={24} />
          </Link>
        ))}
      </div>
      <div className="sector-strip">
        <span className="mono">Also built for</span>
        <span>Professional services</span>
        <span>E-commerce</span>
        <span>Real estate</span>
        <span>Healthcare businesses</span>
      </div>
      <p className="small muted">These are sectors we can serve, not a list of existing clients.</p>
    </section>
  );
}
