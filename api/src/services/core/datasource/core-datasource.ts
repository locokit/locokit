import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import { CoreDatasource } from './core-datasource.class'
import { coreDatasourceQuerySchema, coreDatasourceSchema } from './core-datasource.schema'
import { CoreDatasourceModel } from './core-datasource.model'
import { coreDatasourceHooks } from './core-datasource.hooks'

export function coreDatasourceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: CoreDatasourceModel,
    name: 'lck_datasource',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_DATASOURCE, new CoreDatasource(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'patch'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        coreDatasourceQuerySchema,
        coreDatasourceSchema,
      },
      docs: {
        tag: 'core > datasource',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_DATASOURCE).hooks(coreDatasourceHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_DATASOURCE]: CoreDatasource
  }
}
