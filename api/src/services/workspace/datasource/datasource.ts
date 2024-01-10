import type { Application } from '@/declarations'
import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg

import { WorkspaceDatasourceService } from './datasource.class'
import {
  workspaceDatasourceDataSchema,
  workspaceDatasourceQuerySchema,
  workspaceDatasourceSchema,
} from './datasource.schema'
import { WorkspaceDatasourceModel } from './datasource.model'
import { workspaceDatasourceHooks } from './datasource.hooks'
import { workspaceDatasourceMethods, workspaceDatasourcePath } from './datasource.shared'

/**
 * The datasource is pointing a table `datasource`
 * but it needs a schema.
 *
 * The schema is specific to the workspace.
 *
 * We can't know the schema in advance,
 * so it is set dynamically with a dedicated hook.
 */
export function workspaceDatasourceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: WorkspaceDatasourceModel,
    name: 'datasource',
  }

  // Register our service on the Feathers application
  app.use(workspaceDatasourcePath, new WorkspaceDatasourceService(options), {
    // A list of all methods this service exposes externally
    methods: workspaceDatasourceMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workspaceDatasourceDataSchema,
        workspaceDatasourceQuerySchema,
        workspaceDatasourceSchema,
      },
      docs: {
        tag: 'workspace > datasource',
      },
    }),
  })
  // Initialize hooks
  app.service(workspaceDatasourcePath).hooks(workspaceDatasourceHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [workspaceDatasourcePath]: WorkspaceDatasourceService
  }
}
