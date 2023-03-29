import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'

import { Table } from './table.class'
import { TableModel } from './table.model'
import { tableHooks } from './table.hooks'

// A configure function that registers the service and its hooks via `app.configure`
export function tableService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: TableModel,
    name: 'table',
    allowedGraph: '[fields, relations.[toTable], datasource]',
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_TABLE, new Table(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: {
      tag: 'workspace > datasource > table',
    },
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_TABLE).hooks(tableHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_TABLE]: Table
  }
}
