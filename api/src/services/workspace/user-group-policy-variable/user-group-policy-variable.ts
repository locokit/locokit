import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import {
  WorkspaceUserGroupPolicyVariableService,
  workspaceUserGroupPolicyVariableHooks,
} from './user-group-policy-variable.class'
import { WorkspaceUserGroupPolicyVariableModel } from './user-group-policy-variable.model'
import {
  workspaceUserGroupPolicyVariableDataSchema,
  workspaceUserGroupPolicyVariableQuerySchema,
  workspaceUserGroupPolicyVariableSchema,
} from './user-group-policy-variable.schema'
import {
  workspaceUserGroupPolicyVariableMethods,
  workspaceUserGroupPolicyVariablePath,
} from './user-group-policy-variable.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceUserGroupPolicyVariableService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceUserGroupPolicyVariableModel,
    name: 'workspaceUserGroupPolicyVariable',
    allowedGraph: '[group,user]',
    id: ['userId', 'groupId'],
  }

  // Register our service on the Feathers application
  app.use(
    workspaceUserGroupPolicyVariablePath,
    new WorkspaceUserGroupPolicyVariableService(options),
    {
      // A list of all methods this service exposes externally
      methods: workspaceUserGroupPolicyVariableMethods,
      // You can add additional custom events to be sent to clients here
      events: [],
      docs: createSwaggerServiceOptions({
        schemas: {
          workspaceUserGroupPolicyVariableDataSchema,
          workspaceUserGroupPolicyVariableQuerySchema,
          workspaceUserGroupPolicyVariableSchema,
        },
        docs: {
          description: 'User-group service, association between user and group',
          tag: 'workspace > user-group',
        },
      }),
    },
  )
  // Initialize hooks
  app.service(workspaceUserGroupPolicyVariablePath).hooks(workspaceUserGroupPolicyVariableHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspaceUserGroupPolicyVariablePath]: WorkspaceUserGroupPolicyVariableService
  }
}
