import { Button } from '@/components/ui';
export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };
export default function NotFound() {
  return (
    <section className="shell confirmation">
      <p className="not-found-code">404 / CONNECTION NOT FOUND</p>
      <h1>
        A loose end.
        <br />
        Let’s reconnect<span className="accent">.</span>
      </h1>
      <p className="lead" style={{ marginTop: 28 }}>
        This page may have moved, or the address may be incomplete. The rest of the studio is right
        here.
      </p>
      <div className="confirmation-links">
        <Button href="/">Back to the studio</Button>
        <Button href="/contact" secondary>
          Start a conversation
        </Button>
      </div>
    </section>
  );
}
