import { API_PATH } from '@locokit/definitions'
import type { Application } from '../../../../../declarations'

import { EngineService, recordHooks } from './record.class'

// A configure function that registers the service and its hooks via `app.configure`
export function recordService(app: Application): void {
  // Register our service on the Feathers application
  app.use(API_PATH.WORKSPACE.DATASOURCE.TABLE.RECORD, new EngineService(), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(API_PATH.WORKSPACE.DATASOURCE.TABLE.RECORD).hooks(recordHooks)
}

// Add this service to the service type index
declare module '../../../../../declarations' {
  interface ServiceTypes {
    [API_PATH.WORKSPACE.DATASOURCE.TABLE.RECORD]: EngineService
  }
}
