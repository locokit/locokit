import { SERVICES } from '@locokit/definitions'
import type { Application } from '../../../declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import { Datasource } from './datasource.class'
import { datasourceDataSchema, datasourceQuerySchema, datasourceSchema } from './datasource.schema'
import { DatasourceModel } from './datasource.model'
import { datasourceHooks } from './datasource.hooks'

/**
 * The datasource is pointing a table `datasource`
 * but it needs a schema.
 *
 * The schema is specific to the workspace.
 *
 * We can't know the schema in advance,
 * so it is set dynamically with a dedicated hook.
 */
export function datasourceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: DatasourceModel,
    name: 'datasource',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_DATASOURCE, new Datasource(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove', 'sync', 'diff'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        datasourceDataSchema,
        datasourceQuerySchema,
        datasourceSchema,
      },
      docs: {
        tag: 'workspace > datasource',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_DATASOURCE).hooks(datasourceHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_DATASOURCE]: Datasource
  }
}
