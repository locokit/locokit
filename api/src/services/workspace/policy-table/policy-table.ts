import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { WorkspacePolicyTableService, workspacePolicyTableHooks } from './policy-table.class'
import { WorkspacePolicyTableModel } from './policy-table.model'
import {
  workspacePolicyTableDataSchema,
  workspacePolicyTableQuerySchema,
  workspacePolicyTableSchema,
} from './policy-table.schema'
import { workspacePolicyTableMethods, workspacePolicyTablePath } from './policy-table.shared'

// A configure function that registers the service and its hooks via `app.configure`
export function workspacePolicyTableService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspacePolicyTableModel,
    name: 'policyTable',
    allowedGraph: '[policy]',
  }

  // Register our service on the Feathers application
  app.use(workspacePolicyTablePath, new WorkspacePolicyTableService(options), {
    // A list of all methods this service exposes externally
    methods: workspacePolicyTableMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workspacePolicyTableDataSchema,
        workspacePolicyTableQuerySchema,
        workspacePolicyTableSchema,
      },
      docs: { description: 'Policy table service', tag: 'workspace > policy table' },
    }),
  })
  // Initialize hooks
  app.service(workspacePolicyTablePath).hooks(workspacePolicyTableHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspacePolicyTablePath]: WorkspacePolicyTableService
  }
}
