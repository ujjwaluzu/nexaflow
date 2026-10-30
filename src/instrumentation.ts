export async function register() {
  if (process.env.SENTRY_DSN) {
    await import('./sentry.server.config');
  }
}
export async function onRequestError(error: unknown) {
  if (process.env.SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(new Error(error instanceof Error ? error.name : 'ServerError'));
  }
}
