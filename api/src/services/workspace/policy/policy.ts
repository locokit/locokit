import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { WorkspacePolicyService, workspacePolicyHooks } from './policy.class'
import { WorkspacePolicyModel } from './policy.model'
import {
  workspacePolicyDataSchema,
  workspacePolicyQuerySchema,
  workspacePolicySchema,
} from './policy.schema'
import { workspacePolicyMethods, workspacePolicyPath } from './policy.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspacePolicyService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspacePolicyModel,
    name: 'policy',
    allowedGraph: '[groups]',
  }

  // Register our service on the Feathers application
  app.use(workspacePolicyPath, new WorkspacePolicyService(options), {
    // A list of all methods this service exposes externally
    methods: workspacePolicyMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { workspacePolicyDataSchema, workspacePolicyQuerySchema, workspacePolicySchema },
      docs: { description: 'Policy service', tag: 'workspace > policy' },
    }),
  })
  // Initialize hooks
  app.service(workspacePolicyPath).hooks(workspacePolicyHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspacePolicyPath]: WorkspacePolicyService
  }
}
