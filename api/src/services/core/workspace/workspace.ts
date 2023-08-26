import { SERVICES } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { WorkspaceService } from './workspace.class'
import { workspaceHooks } from './workspace.hooks'
import { WorkspaceModel } from './workspace.model'
import { workspaceDataSchema, workspaceQuerySchema, workspaceSchema } from './workspace.schema'

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceModel,
    name: 'lck_workspace',
    schema: 'core',
    allowedGraph: '[owner,groups,policies,datasources]',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_WORKSPACE, new WorkspaceService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { workspaceDataSchema, workspaceQuerySchema, workspaceSchema },
      docs: { description: 'Workspace service', tag: 'core > workspace' },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_WORKSPACE).hooks(workspaceHooks)
}

declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_WORKSPACE]: WorkspaceService
  }
}
