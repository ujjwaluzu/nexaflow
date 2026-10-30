import Link from 'next/link';
import { services } from '@/data/services';
import { Button, FinalCTA, PageHero, ServiceIcon, TextLink } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Connected digital services',
  'Websites, custom software, intelligent automation and infrastructure. Four connected engineering disciplines, shaped around your business.',
  '/services',
);
export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our capabilities"
        title="From the first impression to the systems behind it."
        description="A website is often the starting point. The real opportunity is connecting it to the software, workflows and infrastructure that keep your business moving."
      >
        <Button href="/contact">Find your starting point</Button>
      </PageHero>
      <section className="shell">
        <ol className="service-index">
          {services.map((service, index) => (
            <li key={service.slug}>
              <span className="mono">{service.number}</span>
              <div>
                <ServiceIcon index={index} size={35} />
                <h2>
                  <Link href={`/services/${service.slug}`}>{service.name}</Link>
                </h2>
                <p>{service.intro}</p>
                <TextLink href={`/services/${service.slug}`}>
                  Explore {service.name.toLowerCase()}
                </TextLink>
              </div>
              <ul>
                {service.deliverables.map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
      <FinalCTA />
    </>
  );
}
