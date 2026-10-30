import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
  defaultIntegrations: false,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    databaseQueryData: false,
    queues: false,
    stackFrameVariables: false,
    frameContextLines: 0,
    genAI: { inputs: false, outputs: false },
    mcp: { inputs: false, outputs: false },
    graphQL: { document: false, variables: false },
  },
  beforeSend(event) {
    delete event.request;
    delete event.user;
    delete event.breadcrumbs;
    delete event.extra;
    return event;
  },
});
