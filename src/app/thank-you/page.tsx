import { z } from 'zod';
import { Button, Label } from '@/components/ui';
export const metadata = { title: 'Enquiry confirmation', robots: { index: false, follow: false } };
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; reference?: string }>;
}) {
  const query = await searchParams;
  const reference = z.uuid().safeParse(query.reference);
  const local = query.mode === 'local';
  return (
    <section className="shell confirmation">
      <Label>
        {reference.success
          ? local
            ? 'Local test complete'
            : 'Enquiry accepted'
          : 'Let’s start a conversation'}
      </Label>
      <h1>
        {reference.success ? (
          <>
            A good starting point<span className="accent">.</span>
          </>
        ) : (
          <>
            Have an idea in mind<span className="accent">?</span>
          </>
        )}
      </h1>
      <p className="lead">
        {reference.success
          ? local
            ? 'Your test enquiry was saved on this development machine. Confirmation and founder emails were simulated; no live email or CRM service was contacted.'
            : 'Thank you for sharing the context. Your enquiry has been recorded for review. Confirmation and notification delivery are handled separately; please allow time for a response.'
          : 'Share a little about what you want to achieve, and we can work out a practical next step.'}
      </p>
      {reference.success && (
        <p className="mono muted" style={{ overflowWrap: 'anywhere' }}>
          REFERENCE / {reference.data}
        </p>
      )}
      <div className="confirmation-links">
        <Button href={reference.success ? '/' : '/contact'}>
          {reference.success ? 'Back to the studio' : 'Start a project'}
        </Button>
        <Button href="/insights" secondary>
          Read our insights
        </Button>
      </div>
    </section>
  );
}
