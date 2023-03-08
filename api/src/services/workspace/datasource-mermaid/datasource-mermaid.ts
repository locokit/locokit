import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import { DatasourceMermaid } from './datasource-mermaid.class'
import { datasourceMermaidHooks } from './datasource-mermaid.hooks'
import { datasourceMermaidQuerySchema } from './datasource-mermaid.schema'

export function datasourceMermaidService(app: Application): void {
  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_DATASOURCE_MERMAID, new DatasourceMermaid(), {
    // A list of all methods this service exposes externally
    methods: ['find'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        datasourceMermaidQuerySchema,
      },
      docs: {
        tag: 'workspace > datasource > mermaid',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_DATASOURCE_MERMAID).hooks(datasourceMermaidHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_DATASOURCE_MERMAID]: DatasourceMermaid
  }
}
