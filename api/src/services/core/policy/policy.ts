import { SERVICES } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '../../../declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { PolicyService, policyHooks } from './policy.class'
import { PolicyModel } from './policy.model'
import { policyDataSchema, policyQuerySchema, policySchema } from './policy.schema'

// A configure function that registers the service and its hooks via `app.configure`
export function policyService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: PolicyModel,
    name: 'lck_policy',
    schema: 'core',
    allowedGraph: '[workspace.owner,groups]',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_POLICY, new PolicyService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { policyDataSchema, policyQuerySchema, policySchema },
      docs: { description: 'Policy service', tag: 'core > policy' },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_POLICY).hooks(policyHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_POLICY]: PolicyService
  }
}
