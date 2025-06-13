import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import {
  WorkspacePolicyTableFieldService,
  workspacePolicyTableFieldHooks,
} from './policy-table-field.class'
import { WorkspacePolicyTableFieldModel } from './policy-table-field.model'
import {
  workspacePolicyTableFieldDataSchema,
  workspacePolicyTableFieldQuerySchema,
  workspacePolicyTableFieldSchema,
} from './policy-table-field.schema'
import {
  workspacePolicyTableFieldMethods,
  workspacePolicyTableFieldPath,
} from './policy-table-field.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspacePolicyTableFieldService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspacePolicyTableFieldModel,
    name: 'policy-table-field',
    allowedGraph: '[policy,tableField]',
  }

  // Register our service on the Feathers application
  app.use(workspacePolicyTableFieldPath, new WorkspacePolicyTableFieldService(options), {
    // A list of all methods this service exposes externally
    methods: workspacePolicyTableFieldMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workspacePolicyTableFieldDataSchema,
        workspacePolicyTableFieldQuerySchema,
        workspacePolicyTableFieldSchema,
      },
      docs: { description: 'Policy table field service', tag: 'workspace > policy table field' },
    }),
  })
  // Initialize hooks
  app.service(workspacePolicyTableFieldPath).hooks(workspacePolicyTableFieldHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspacePolicyTableFieldPath]: WorkspacePolicyTableFieldService
  }
}
