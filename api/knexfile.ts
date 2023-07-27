/* eslint-disable import/first */
// import * as dotenv from 'dotenv'

// dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV as string}` : '.env' })
import dotenv from 'dotenv-flow'
dotenv.config()

import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa } from '@feathersjs/koa'

import { configurationValidator } from './src/commons/configuration.schema'

const app = koa(feathers())
// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Load our database connection info from the app configuration
const config = app.get('settings').db

module.exports = config
