/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config()

import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa } from '@feathersjs/koa'

import { configurationValidator } from './src/schemas/configuration.schema'

const app = koa(feathers())
// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Load our database connection info from the app configuration
const config = app.get('settings').db

module.exports = config
