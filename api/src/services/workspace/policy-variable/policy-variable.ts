import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import {
  WorkspacePolicyVariableService,
  workspacePolicyVariableHooks,
} from './policy-variable.class'
import { WorkspacePolicyVariableModel } from './policy-variable.model'
import {
  workspacePolicyVariableDataSchema,
  workspacePolicyVariableQuerySchema,
  workspacePolicyVariableSchema,
} from './policy-variable.schema'
import {
  workspacePolicyVariableMethods,
  workspacePolicyVariablePath,
} from './policy-variable.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspacePolicyVariableService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspacePolicyVariableModel,
    name: 'policy-variable',
    allowedGraph: '[policy]',
  }

  // Register our service on the Feathers application
  app.use(workspacePolicyVariablePath, new WorkspacePolicyVariableService(options), {
    // A list of all methods this service exposes externally
    methods: workspacePolicyVariableMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workspacePolicyVariableDataSchema,
        workspacePolicyVariableQuerySchema,
        workspacePolicyVariableSchema,
      },
      docs: { description: 'Policy variable service', tag: 'workspace > policy variable' },
    }),
  })
  // Initialize hooks
  app.service(workspacePolicyVariablePath).hooks(workspacePolicyVariableHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspacePolicyVariablePath]: WorkspacePolicyVariableService
  }
}
