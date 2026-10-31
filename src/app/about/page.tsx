import { brand } from '@/config/brand';
import { Button, FinalCTA, PageHero } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'An independent engineering studio',
  'A founder-led approach to websites, software and automation. Direct communication, considered decisions and dependable digital systems.',
  '/about',
);
export default function AboutPage() {
  return (
    <>
      <PageHero
        title="A small studio. A connected way of thinking."
        description={`${brand.name} is a founder-led digital engineering and automation studio for businesses in India and international markets. Design, code and operational thinking belong in the same conversation.`}
      >
        <Button href="/contact">Meet your next project</Button>
      </PageHero>
      <section className="content-section shell">
        <p className="manifesto" style={{ marginTop: 30 }}>
          Good technology should make a business easier to run.{' '}
          <span className="muted">
            It should be clear to use, dependable in production and understandable to the person who
            works on it next.
          </span>
        </p>
      </section>
      <section className="section shell split-content">
        <div>
          <h2>
            Direct by nature.
            <br />
            Deliberate in practice.
          </h2>
        </div>
        <div className="body-copy">
          <p className="lead">You work directly with the engineer responsible for the project.</p>
          <p>
            That keeps context close to the work. Questions about business requirements, design and
            implementation can be resolved together, with clear decisions and fewer handoffs.
          </p>
          <p>
            The studio begins with a solo founder. Where a project benefits from specialist design,
            engineering or content support, contractors and partners can be brought into an
            explicitly agreed scope. There is no implied in-house team behind the name.
          </p>
          <p>
            Before an engagement starts, we agree what is included, who is involved, what is
            expected from your side and how delivery will be reviewed.
          </p>
        </div>
      </section>
      <section className="content-section shell">
        <ol className="values-list" style={{ marginTop: 35 }}>
          {[
            {
              title: 'Understand before building.',
              text: 'Start with the people, workflow and constraints. A clear problem statement is more useful than a long feature list.',
            },
            {
              title: 'Make the important things explicit.',
              text: 'Scope, ownership, costs and acceptance criteria should be written down. Surprises are a poor project management tool.',
            },
            {
              title: 'Prefer the maintainable solution.',
              text: 'Choose familiar tools where they fit. Use abstractions when they reduce complexity and document the decisions that matter.',
            },
            {
              title: 'Build for the handover.',
              text: 'Source code, configuration and operational guidance should leave the business with a system it can understand and continue to own.',
            },
            {
              title: 'Keep a long-term perspective.',
              text: 'A launch is one stage in a system’s life. Maintenance, accessibility, reliability and future changes deserve attention from the beginning.',
            },
          ].map((item, index) => (
            <li key={item.title}>
              <span className="mono accent">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <FinalCTA />
    </>
  );
}
