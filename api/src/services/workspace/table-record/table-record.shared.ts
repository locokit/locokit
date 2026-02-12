// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/shared'
import type { TableRecordService } from './table-record.class'

export type TableRecordClientService = Pick<
  TableRecordService,
  (typeof workspaceTableRecordMethods)[number]
>

export const workspaceTableRecordPath = SERVICES.WORKSPACE_TABLE_RECORD

export const workspaceTableRecordMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspaceTableRecordClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspaceTableRecordPath, connection.service(workspaceTableRecordPath), {
    methods: workspaceTableRecordMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspaceTableRecordPath]: TableRecordClientService
  }
}
