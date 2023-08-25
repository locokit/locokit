import type { Application } from '@/declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import { CoreDatasourceService } from './core-datasource.class'
import { coreDatasourceQuerySchema, coreDatasourceSchema } from './core-datasource.schema'
import { CoreDatasourceModel } from './core-datasource.model'
import { coreDatasourceHooks } from './core-datasource.hooks'
import { datasourceMethods, datasourcePath } from './core-datasource.shared'

export function coreDatasourceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: CoreDatasourceModel,
    name: 'lck_datasource',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(datasourcePath, new CoreDatasourceService(options), {
    // A list of all methods this service exposes externally
    methods: datasourceMethods,
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
  app.service(datasourcePath).hooks(coreDatasourceHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [datasourcePath]: CoreDatasourceService
  }
}
