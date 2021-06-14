import dotenv from 'dotenv'
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
import casl from 'feathers-casl'

import { Application } from './declarations'
import logger from './logger'
import services from './services'
import appHooks from './app.hooks'
// import channels from './channels';
import objection from './objection'
// Don't remove this comment. It's needed to format import lines nicely.
import * as Sentry from '@sentry/node'
import { Integrations } from '@sentry/tracing'
/**
 * read .env file
 */
dotenv.config()

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
app.configure(casl())

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', "'unsafe-eval'"],
      'worker-src': ['blob:'], // needed by redoc swagger
    },
  },
}))
app.use(cors(app.get('cors')))
app.use(compress())
const maxUploadSize = app.get('storage').maxUploadSize || '5mb'
app.use(express.json({
  limit: maxUploadSize,
}))
app.use(express.urlencoded({
  extended: true,
  limit: maxUploadSize,
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
  docsJsonPath: '/swagger.json',
  specs: {
    info: {
      title: 'LoCoKit API platform',
      description: `
# Introduction

Welcome at the API documentation of the **Low-Code Kit API platform**.

The front communicate exclusively with this API,
and this swagger is here to document the more we can how does this API works,
models, constraints, ...

Be kind, all schemas are not really finished,
so don't hesitate to give us feedback on this swagger
and what could be missing.

# What's under the hood ?

The LocoKit API use [FeathersJS](feathersjs.com/) as a node framework,
[Objection.js](https://vincit.github.io/objection.js/) as the database ORM
and [CASL](https://casl.js.org) as the ACL security layer.

This could be nice to read a little how FeathersJS works, CASL and objection too.

Here are some links :
* [FeathersJS's documentation](https://docs.feathersjs.com/)
* [Objection.js](https://vincit.github.io/objection.js/)
* [feathers-objection](https://github.com/feathersjs-ecosystem/feathers-objection/), wrapper between objection and FeathersJS
  * see [query operators](https://github.com/feathersjs-ecosystem/feathers-objection/#default-query-operators)
  to understand how you could filter data
* [CASL](https://casl.js.org)
* [feathers-casl](https://feathers-casl.netlify.app/), wrapper between CASL and FeathersJS

# Authentication

To use this API, you need credentials, and more precisely a JWT.

You can obtain by login with your credentials against the \`/authentication\` endpoint.

Once the JWT retrieved, concatenate it to the \`"Bearer "\` string (with a space in the end),
then add it in each request in the header \`Authorization\`.

You'll be able to make your request, according your permissions / ACLs.
`,
      version: process.env.npm_version || 'local version',
      'x-logo': {
        url: '/logokit-grayscale.png',
      },
      host: app.get('publicUrl'),
    },
    'x-tagGroups': [
      {
        name: 'Authentication',
        tags: [
          'authManagement',
          'authentication',
          'user',
          'group',
          'usergroup',
        ],
      }, {
        name: 'Access Control List',
        tags: [
          'aclset',
        ],
      }, {
        name: 'Data',
        tags: [
          'workspace',
          'table',
          'column',
          'columnrelation',
          'row',
          'trr',
          'view',
          'table-view-has-table-column',
          'attachment',
          'upload',
        ],
      }, {
        name: 'CMS',
        tags: [
          'chapter',
          'page',
          'container',
          'block',
        ],
      }, {
        name: 'Orchestration',
        tags: [
          'process',
          'process-run',
        ],
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Bearer ',
        },
      },
    },
    security: [{
      BearerAuth: [],
    }],
  },
  uiIndex: path.join(__dirname, '../public/swagger.html'),
  // uiIndex: true,
  defaults: {
    schemasGenerator (service, model, modelName) {
      const modelsToIgnore = ['upload']
      if (modelsToIgnore.includes(modelName)) {
        return {
          [model]: {
            type: 'object',
            properties: {
              uri: { type: 'string' },
              buffer: { type: 'Buffer' },
              contentType: { type: 'string' },
            },
          },
          [`${model}_list`]: {
            title: `${modelName} list`,
            type: 'array',
            items: { $ref: `#/components/schemas/${model}` },
          },
        }
      }
      return {
        [model]: service?.docs?.definition || service?.jsonSchema,
        [`${model}_list`]: {
          title: `${modelName} list`,
          type: 'array',
          items: { $ref: `#/components/schemas/${model}` },
        },
      }
    },
  },
  /**
   * Here we add regexp
   * for ignoring some services
   * we don't want to expose publicly.
   * (but they exist in the code)
   */
  ignore: {
    paths: [
      /mailer/,
      /permission/,
    ],
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
