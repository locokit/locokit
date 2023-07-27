/* eslint-disable import/first */
/**
 * First load the .env file
 */
// import * as dotenv from 'dotenv'

// dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV as string}` : '.env' })
import dotenv from 'dotenv-flow'
dotenv.config()

import serveStatic from 'koa-static'
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication } from '@feathersjs/koa'
import cors from '@koa/cors'
import socketio from '@feathersjs/socketio'
import swagger from 'feathers-swagger'

import helmet from 'koa-helmet'

import type { Application } from './declarations'
import { configurationValidator } from './commons/configuration.schema'
import { logErrorHook } from './logger'
import { db } from './db'
import { services } from './services'
import { channels } from './channels'

export function createApp(): Application {
  const app: Application = koa(feathers())
  app.use(cors({}))

  // Load our app configuration (see config/ folder)
  app.configure(configuration(configurationValidator))

  // Set up Koa middleware
  app.use(serveStatic(app.get('public')))
  app.use(errorHandler())
  app.use(parseAuthentication())
  app.use(bodyParser())

  const helmetSettings = app.get('helmet')
  if (helmetSettings?.isEnabled) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
        },
        hsts: helmetSettings?.hstsEnabled,
      }),
    )
  }

  app.configure(
    swagger({
      specs: {
        info: {
          title: 'LocoKit API platform',
          description: `

# 🚉 Welcome aboard!

**Welcome to the swagger of LocoKit API.**

Here, you can find all global endpoints / services of the API.

Please use it with a JSON Web Token retrieved with the /login endpoint
to access your data.

Without a JWT, you are considered as a public user.

If you want to access data for a specific workspace,
you'll have to open a new tab with an URL like this:

\`http[s]://{yourhost}[:yourport]/workspace/{yourworkspaceslug}/swagger.html\`

If you encounter any issue when using this swagger,
or the LocoKit platform,
please:
* check if this issue already exist on [github](https://github.com/locokit/locokit/issues)
* [create](https://github.com/locokit/locokit/issues/new) an issue if needed
* or a [discussion](https://github.com/locokit/locokit/discussions) if this is a question

We hope you will enjoy this tool!

*The LocoKit team*
`,
          version: process.env.npm_package_version ?? 'dev',
        },
      },
    }),
  )

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

  return app
}

/**
 * For feathers-vite compatibility, export a main const
 */
export const main = createApp
