import { industries } from '@/data/industries';
import { FinalCTA, PageHero, TextLink } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'Solutions for your business',
  'Digital engineering for startups, small businesses and growing teams, with practical use cases across service and commerce businesses.',
  '/industries',
);
export default function IndustriesPage() {
  return (
    <>
      <PageHero
        title="The technology changes. Your business comes first."
        description="Different businesses need different systems. The starting point is always the work: who does it, where it gets stuck, and what a better outcome would look like."
      />
      <section className="shell industry-overview">
        {industries.map((item) => (
          <article key={item.slug}>
            <h2>{item.name}</h2>
            <p>{item.intro}</p>
            <TextLink href={`/industries/${item.slug}`}>
              Explore solutions for {item.name.toLowerCase()}
            </TextLink>
          </article>
        ))}
      </section>
      <section className="section shell">
        <h2 className="section-intro">Other businesses we can support.</h2>
        <div className="industry-other">
          {[
            {
              name: 'Professional services',
              text: 'Clear service websites, customer intake and connected follow-ups for advisory and service-led businesses.',
            },
            {
              name: 'E-commerce & real estate',
              text: 'Commerce integrations, listing experiences, lead routing and internal workflow tools around established platforms.',
            },
            {
              name: 'Healthcare businesses',
              text: 'Public information websites and non-clinical administration. Sensitive health data requires separate privacy, security and regulatory assessment.',
            },
          ].map((item) => (
            <article key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 35 }}>
          These are potential applications of our capabilities. They do not represent existing
          customers or sector certifications.
        </p>
        <TextLink href="/contact">Discuss your business context</TextLink>
      </section>
      <FinalCTA />
    </>
  );
}
