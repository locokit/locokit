import logger from './logger';
import app from './app';
import * as Sentry from '@sentry/node';
import * as Apm from '@sentry/apm';

Sentry.init({
  dsn: "https://e67ca7398fee48e9b3044969681b3ce4@o421199.ingest.sentry.io/5340661",
  integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Apm.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0 // Be sure to lower this in production
});


// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app

app.use(Sentry.Handlers.errorHandler());

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
