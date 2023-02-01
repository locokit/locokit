/* eslint-disable import/first */
/**
 * First load the .env fil
 */
import dotenv from 'dotenv'
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
import { configurationValidator } from './schemas/configuration.schema'
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
          description: 'A description',
          version: '1.0.0-alpha.0',
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
