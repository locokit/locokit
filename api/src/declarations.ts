import {
  HookContext as FeathersHookContext,
  HookFunction as FeathersHookFunction,
  Hook as FeathersHook,
  NextFunction,
} from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { ConfigurationSchema } from './commons/configuration.schema'
import { ServiceSwaggerOptions } from 'feathers-swagger'

import { UserResult } from './services/core/user/user.schema'
import { WorkspaceResult } from './services/core/workspace/workspace.schema'
import { DatasourceResult } from './services/core/datasource/datasource.schema'
import { WorkflowResult } from './services/workspace/workflow/workflow.schema'

export { NextFunction }

export interface Configuration extends ConfigurationSchema {}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

export type HookContext<S = any> = FeathersHookContext<Application, S>
export type Hook<S = any> = FeathersHook<Application, S>
export type HookFunction<S = any> = FeathersHookFunction<Application, S>

// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: UserResult
    $locokit?: {
      currentWorkspace?: WorkspaceResult
      currentWorkspaceSlug?: string
      currentDatasource?: DatasourceResult
      currentDatasourceSlug?: string
      currentWorkflow?: WorkflowResult
      currentWorkflowSlug?: string
    }
  }
  interface ServiceOptions {
    docs?: ServiceSwaggerOptions
  }
}

export type stringNumberUndefined = string | number | undefined
