import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
// import socketio from '@feathersjs/socketio'
import swagger from 'feathers-swagger'

import { Application } from './declarations'
import logger from './logger'
import services from './services'
import appHooks from './app.hooks'
// import channels from './channels';
import objection from './objection'
// Don't remove this comment. It's needed to format import lines nicely.
import * as Sentry from '@sentry/node'
import { Integrations } from '@sentry/tracing'
require('dotenv').config()

const app: Application = express(feathers())

Sentry.init({
  // dsn: '', // use of SENTRY_DSN
  // environment: process.env.NODE_ENV, // use of SENTRY_ENVIRONMENT
  // release: '0.0.4', // use of SENTRY_RELEASE
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Integrations.Express({ app }),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0, // Be sure to lower this in production
})

// Load app configuration
app.configure(configuration())

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// the rest of your app

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors(app.get('cors')))
app.use(compress())
app.use(express.json({
  limit: '20mb',
}))
app.use(express.urlencoded({
  extended: true,
  limit: '20mb',
}))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())
// app.configure(socketio())

app.configure(objection)

app.configure(swagger({
  openApiVersion: 3,
  docsPath: '/swagger',
  specs: {
    info: {
      title: 'LoCoKit API platform',
      description:
        'This is the swagger for **Low-Code Kit API platform**\n' +
        'Please use this swagger to test your ideas',
      version: process.env.npm_version ?? 'unknown',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      BearerAuth: [],
    }],
  },
  uiIndex: true,
  defaults: {
    schemasGenerator (service, model, modelName) {
      return {
        [model]: service.model,
        [`${model}`]: {
          title: `${modelName}`,
          type: 'object',
          items: { $ref: `#/components/schemas/${model}` },
        },
        [`${model}_list`]: {
          title: `${modelName} list`,
          type: 'array',
          items: { $ref: `#/components/schemas/${model}_list` },
        },
      }
    },
  },
}))

// Set up our services (see `services/index.js`)
app.configure(services)

// Set up event channels (see channels.js)
// app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(Sentry.Handlers.errorHandler({
  shouldHandleError: () => (true),
}))
app.use(express.notFound())
app.use(express.errorHandler({ logger } as any))

app.hooks(appHooks)

export default app
