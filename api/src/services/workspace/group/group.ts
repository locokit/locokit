import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { WorkspaceGroupService, workspaceGroupHooks } from './group.class'
import { WorkspaceGroupModel } from './group.model'
import {
  workspaceGroupDataSchema,
  workspaceGroupQuerySchema,
  workspaceGroupSchema,
} from './group.schema'
import { workspaceGroupMethods, workspaceGroupPath } from './group.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceGroupService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceGroupModel,
    name: 'group',
    allowedGraph: '[users,policy,groupPolicyVariable]',
  }

  // Register our service on the Feathers application
  app.use(workspaceGroupPath, new WorkspaceGroupService(options), {
    // A list of all methods this service exposes externally
    methods: workspaceGroupMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { workspaceGroupDataSchema, workspaceGroupQuerySchema, workspaceGroupSchema },
      docs: { description: 'Group service', tag: 'workspace > workspaceGroup' },
    }),
  })
  // Initialize hooks
  app.service(workspaceGroupPath).hooks(workspaceGroupHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspaceGroupPath]: WorkspaceGroupService
  }
}
