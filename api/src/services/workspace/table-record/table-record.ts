import { SERVICES } from '@locokit/shared'
import type { Application } from '@/declarations'

import { TableRecord } from './table-record.class'
import { tableRecordHooks } from './table-record.hooks'

/**
 * Virtual service able to retrieve data
 * through the LocoKit engine package.
 *
 * The table record service will retrieve datasource credentials
 * and remotely / locally access to it.
 *
 * Then it will process the related query (CRUD) on it,
 * applying the right policy, according the user connected
 * and the group he's using to access the data (default group = first one ?).
 */
export function tableRecordService(app: Application): void {
  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_TABLE_RECORD, new TableRecord(), {
    // A list of all methods this service exposes externally
    methods: ['get', 'find', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: {
      tag: 'workspace > datasource > table > record',
    },
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_TABLE_RECORD).hooks(tableRecordHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_TABLE_RECORD]: TableRecord
  }
}
