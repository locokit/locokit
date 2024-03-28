import type { Application } from '@/declarations'
import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg

import { DatasourceService } from './datasource.class'
import { coreDatasourceQuerySchema, coreDatasourceSchema } from './datasource.schema'
import { DatasourceModel } from './datasource.model'
import { coreDatasourceHooks } from './datasource.hooks'
import { datasourceMethods, datasourcePath } from './datasource.shared'

export function coreDatasourceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: DatasourceModel,
    name: 'lck_datasource',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(datasourcePath, new DatasourceService(options), {
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
    [datasourcePath]: DatasourceService
  }
}
