import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import {
  WorkspaceGroupPolicyVariableService,
  workspaceGroupPolicyVariableHooks,
} from './group-policy-variable.class'
import { WorkspaceGroupPolicyVariableModel } from './group-policy-variable.model'
import {
  workspaceGroupPolicyVariableDataSchema,
  workspaceGroupPolicyVariableQuerySchema,
  workspaceGroupPolicyVariableSchema,
} from './group-policy-variable.schema'
import {
  workspaceGroupPolicyVariableMethods,
  workspaceGroupPolicyVariablePath,
} from './group-policy-variable.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceGroupPolicyVariableService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceGroupPolicyVariableModel,
    name: 'groupPolicyVariable',
    allowedGraph: '[policy,group]',
  }

  // Register our service on the Feathers application
  app.use(workspaceGroupPolicyVariablePath, new WorkspaceGroupPolicyVariableService(options), {
    // A list of all methods this service exposes externally
    methods: workspaceGroupPolicyVariableMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workspaceGroupPolicyVariableDataSchema,
        workspaceGroupPolicyVariableQuerySchema,
        workspaceGroupPolicyVariableSchema,
      },
      docs: { description: 'Policy variable service', tag: 'workspace > policy variable' },
    }),
  })
  // Initialize hooks
  app.service(workspaceGroupPolicyVariablePath).hooks(workspaceGroupPolicyVariableHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspaceGroupPolicyVariablePath]: WorkspaceGroupPolicyVariableService
  }
}
