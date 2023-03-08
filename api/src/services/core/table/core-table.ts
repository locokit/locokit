import { API_PATH } from '@locokit/definitions'
import type { Application } from '@/declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import { CoreTable } from './core-table.class'
import { coreTableQuerySchema, coreTableSchema } from './core-table.schema'
import { CoreTableModel } from './core-table.model'
import { coreTableHooks } from './core-table.hooks'

export function coreTableService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: CoreTableModel,
    name: 'lck_table',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(API_PATH.CORE.TABLE, new CoreTable(options), {
    // A list of all methods this service exposes externally
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
  app.service(API_PATH.CORE.TABLE).hooks(coreTableHooks)
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.CORE.TABLE]: CoreTable
  }
}
