import { SERVICES } from '@locokit/definitions'
import type { Application } from '../../../declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { TableRelationModel } from './table-relation.model'
import { TableRelation } from './table-relation.class'
import { tableRelationDataSchema, tableRelationQuerySchema, tableRelationSchema } from './table-relation.schema'
import { tableRelationHooks } from './table-relation.hooks'

/**
 * The tableRelation is pointing a table `tableRelation`
 * but it needs a schema.
 *
 * The schema is specific to the workspace.
 *
 * We can't know the schema in advance,
 * so it is set dynamically with a dedicated hook.
 */
export function tableRelationService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: TableRelationModel,
    name: 'tableRelation',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_TABLE_RELATION, new TableRelation(options), {
    // A list of all methods this service exposes externally
    methods: ['get', 'find', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        tableRelationDataSchema,
        tableRelationQuerySchema,
        tableRelationSchema,
      },
      docs: {
        tag: 'workspace > datasource > table > field',
      },
    }),
  })

  app.service(SERVICES.WORKSPACE_TABLE_RELATION).hooks(tableRelationHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_TABLE_RELATION]: TableRelation
  }
}
