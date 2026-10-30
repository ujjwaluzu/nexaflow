'use client';
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{ background: '#0a0a0a', color: '#f2f3f1', fontFamily: 'sans-serif', padding: 40 }}
      >
        <h1>A temporary interruption.</h1>
        <p>Please try loading the website again.</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
