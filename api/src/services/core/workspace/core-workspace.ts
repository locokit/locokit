import { API_PATH } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { WorkspaceService } from './core-workspace.class'
import { workspaceHooks } from './core-workspace.hooks'
import { WorkspaceModel } from './core-workspace.model'
import { workspaceDataSchema, workspaceQuerySchema, workspaceSchema } from './core-workspace.schema'

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceModel,
    name: 'lck_workspace',
    schema: 'core',
    allowedGraph: '[owner,groups,roles]',
  }

  // Register our service on the Feathers application
  app.use(API_PATH.WORKSPACE.ROOT, new WorkspaceService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { workspaceDataSchema, workspaceQuerySchema, workspaceSchema },
      docs: { description: 'Workspace service' },
    }),
  })
  // Initialize hooks
  app.service(API_PATH.WORKSPACE.ROOT).hooks(workspaceHooks)
}
