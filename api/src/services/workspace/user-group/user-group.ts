import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { WorkspaceUserGroupService, workspaceUserGroupHooks } from './user-group.class'
import { WorkspaceUserGroupModel } from './user-group.model'
import {
  workspaceUserGroupDataSchema,
  workspaceUserGroupQuerySchema,
  workspaceUserGroupSchema,
} from './user-group.schema'
import { workspaceUserGroupMethods, workspaceUserGroupPath } from './user-group.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceUserGroupService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceUserGroupModel,
    name: 'userGroup',
    allowedGraph: '[group,user]',
  }

  // Register our service on the Feathers application
  app.use(workspaceUserGroupPath, new WorkspaceUserGroupService(options), {
    // A list of all methods this service exposes externally
    methods: workspaceUserGroupMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workspaceUserGroupDataSchema,
        workspaceUserGroupQuerySchema,
        workspaceUserGroupSchema,
      },
      docs: {
        description: 'User-group service, association between user and group',
        tag: 'workspace > user-group',
      },
    }),
  })
  // Initialize hooks
  app.service(workspaceUserGroupPath).hooks(workspaceUserGroupHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspaceUserGroupPath]: WorkspaceUserGroupService
  }
}
