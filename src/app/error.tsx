'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="shell confirmation">
      <h1>Something didn’t connect.</h1>
      <p className="lead" style={{ marginTop: 25 }}>
        Please try this page again. If you were filling in an enquiry, avoid including sensitive
        information when reporting a problem.
      </p>
      <div className="confirmation-links">
        <button className="button button-primary" onClick={reset}>
          Try again
        </button>
        <Link className="button button-secondary" href="/">
          Back to the studio
        </Link>
      </div>
    </section>
  );
}
