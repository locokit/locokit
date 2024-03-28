import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'
import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg

import { Table } from './table.class'
import { coreTableQuerySchema, coreTableSchema } from './table.schema'
import { TableModel } from './table.model'
import { coreTableHooks } from './table.hooks'

export function coreTableService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: TableModel,
    name: 'lck_table',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_TABLE, new Table(options), {
    // A list of all methods this service exposes externally
    // we must not create tables from this service
    // core/table is here to access all tables from all workspaces,
    // and maybe patch them
    // workspace/table is the endpoint to use for creating tables,
    // related to a specific workspace
    methods: ['find', 'get', 'patch'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        coreTableQuerySchema,
        coreTableSchema,
      },
      docs: {
        tag: 'core > table',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_TABLE).hooks(coreTableHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_TABLE]: Table
  }
}
