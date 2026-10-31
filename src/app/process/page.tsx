import { processSteps } from '@/data/process';
import { Button, FinalCTA, PageHero } from '@/components/ui';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata = makeMetadata(
  'How we work',
  'Discover, define, engineer, launch and support. A practical delivery process with clear artifacts, regular reviews and explicit ownership.',
  '/process',
);
export default function ProcessPage() {
  return (
    <>
      <PageHero
        title="Clarity at every step. Working software at the end."
        description="A useful process makes decisions easier. We work in reviewable stages, keep scope visible and define what a successful handover looks like before the build begins."
      >
        <Button href="/contact">Start at discovery</Button>
      </PageHero>
      <section className="shell">
        {processSteps.map((step, index) => (
          <article key={step.name} className="process-detail">
            <span className="mono">0{index + 1}</span>
            <div>
              <h2>{step.name}</h2>
              <p>{step.text}</p>
              <p style={{ marginTop: 20 }}>
                {
                  [
                    'We discuss goals, users, current tools, constraints and the examples that show the problem. Existing software and access are reviewed only as needed.',
                    'We agree the essential workflows, design direction, data model and delivery boundaries. Third-party costs, dependencies and responsibilities are visible in the proposal.',
                    'We build in focused increments and share working progress. Feedback is evaluated against the agreed goals; changes to scope are discussed before implementation.',
                    'We check the important workflows, device layouts and integration failure paths. Deployment, environment configuration and ownership are reviewed before release.',
                    'We agree the support scope, response arrangements and maintenance ownership. New work is prioritised using actual feedback and operating needs.',
                  ][index]
                }
              </p>
            </div>
            <div className="process-output">
              <p>{step.output}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="content-section shell split-content">
        <div>
          <h2>Good delivery is a shared responsibility.</h2>
        </div>
        <div className="body-copy">
          <p>
            We ask for a clear decision-maker, timely feedback and access to the content or systems
            needed for the agreed work. You can expect direct communication, written decisions and
            an honest view of constraints.
          </p>
          <p>
            Timelines and fees are agreed for the actual scope. Changes, platform dependencies and
            content delays are discussed openly; they are not hidden behind a generic fixed promise.
          </p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
