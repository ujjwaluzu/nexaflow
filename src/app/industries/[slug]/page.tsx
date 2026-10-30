import { notFound } from 'next/navigation';
import { industries } from '@/data/industries';
import { Breadcrumbs, Button, FinalCTA, Label, PageHero, SectionHeading } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const dynamicParams = false;
export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = industries.find((i) => i.slug === slug);
  return item
    ? makeMetadata(
        `Digital solutions for ${item.name.toLowerCase()}`,
        item.intro,
        `/industries/${slug}`,
      )
    : {};
}
export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = industries.find((i) => i.slug === slug);
  if (!item) notFound();
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Industries', href: '/industries' },
          { label: item.name, href: `/industries/${slug}` },
        ]}
      />
      <PageHero
        eyebrow={`Built for ${item.name.toLowerCase()}`}
        title={item.headline}
        description={item.intro}
      >
        <Button href="/contact">Talk through your idea</Button>
      </PageHero>
      <section className="content-section shell split-content">
        <div>
          <Label>Start with the work</Label>
          <h2>A useful problem deserves a considered solution.</h2>
        </div>
        <div className="body-copy">
          <p className="lead">{item.problem}</p>
          <p>{item.approach}</p>
        </div>
      </section>
      <section className="section shell">
        <SectionHeading label="Where we can help" title="Practical ways to move forward." />
        <div className="deliverables">
          {item.uses.map((use, index) => (
            <article className="deliverable" key={use.title}>
              <span className="mono">0{index + 1}</span>
              <h3>{use.title}</h3>
              <p>{use.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section shell split-content">
        <div>
          <Label>Your first step</Label>
          <h2>
            Bring the context.
            <br />
            We’ll bring the questions.
          </h2>
        </div>
        <div className="body-copy">
          <p className="lead">{item.start}</p>
          <p>{item.boundary}</p>
          <div style={{ marginTop: 25 }}>
            <Button href="/contact">Start a conversation</Button>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
