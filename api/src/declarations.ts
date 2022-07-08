import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { ConfigurationSchema } from './schemas/configuration.schema'

import { UsersResult } from './schemas/users.schema'

export { NextFunction }

export interface Configuration extends ConfigurationSchema {}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

export type HookContext = FeathersHookContext<Application>

// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: UsersResult
  }
}
