import * as dotenv from 'dotenv'
import serveStatic from 'koa-static'
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import {
  koa,
  rest,
  bodyParser,
  errorHandler,
  parseAuthentication,
} from '@feathersjs/koa'
import cors from '@koa/cors'
import socketio from '@feathersjs/socketio'

import helmet from 'koa-helmet'

import type { Application } from './declarations'
import { configurationSchema } from './schemas/configuration.schema'
import { logErrorHook } from './logger'
import { db } from './db'
import { services } from './services'
import { channels } from './channels'

dotenv.config()

const app: Application = koa(feathers())
app.use(cors({}))

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationSchema))

// Set up Koa middleware
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

const helmetSettings = app.get('helmet')
if (helmetSettings?.isEnabled === 'true') {
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        // directives: {
        //   'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://unpkg.com'],
        //   'worker-src': ['blob:'], // needed by redoc swagger
        // },
      },
      hsts: helmetSettings?.hstsEnabled === 'true',
    }),
  )
}

// Configure services and transports
app.configure(rest())
app.configure(socketio())
app.configure(db)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logErrorHook],
  },
  before: {},
  after: {},
  error: {},
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: [],
})

export { app }
