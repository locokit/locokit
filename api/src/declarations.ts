import {
  HookContext as FeathersHookContext,
  HookFunction as FeathersHookFunction,
  Hook as FeathersHook,
  NextFunction,
} from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
// import { Application as KoaFeathers } from '@feathersjs/koa'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { ConfigurationSchema } from './schemas/configuration.schema'
import { ServiceSwaggerOptions } from 'feathers-swagger'

import { UserResult } from './services/auth/user/user.schema'
import { API_PATH } from '@locokit/definitions'
import { WorkspaceService } from './services/workspace/workspace.class'

export { NextFunction }

export interface Configuration extends ConfigurationSchema { }

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {
  [API_PATH.WORKSPACE.ROOT]: WorkspaceService
}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

export type HookContext<S = any> = FeathersHookContext<Application, S>
export type Hook<S = any> = FeathersHook<Application, S>
export type HookFunction<S = any> = FeathersHookFunction<Application, S>

// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: UserResult
  }
  interface ServiceOptions {
    docs?: ServiceSwaggerOptions
  }
}