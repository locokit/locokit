import { SERVICES } from '@locokit/definitions'
import type { Application } from '../../../declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { TableFieldModel } from './table-field.model'
import { TableField } from './table-field.class'
import { tableFieldDataSchema, tableFieldQuerySchema, tableFieldSchema } from './table-field.schema'
import { tableFieldHooks } from './table-field.hooks'

/**
 * The tableField is pointing a table `tableField`
 * but it needs a schema.
 *
 * The schema is specific to the workspace.
 *
 * We can't know the schema in advance,
 * so it is set dynamically with a dedicated hook.
 */
export function tableFieldService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: TableFieldModel,
    name: 'tableField',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_TABLE_FIELD, new TableField(options), {
    // A list of all methods this service exposes externally
    methods: ['get', 'find', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        tableFieldDataSchema,
        tableFieldQuerySchema,
        tableFieldSchema,
      },
      docs: {
        tag: 'workspace > datasource > table > field',
      },
    }),
  })

  app.service(SERVICES.WORKSPACE_TABLE_FIELD).hooks(tableFieldHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_TABLE_FIELD]: TableField
  }
}
