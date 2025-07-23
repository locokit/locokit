// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { WorkspacePolicyTableService } from './policy-table.class'
export type {
  WorkspacePolicyTableData,
  WorkspacePolicyTablePatch,
  WorkspacePolicyTableResult,
  WorkspacePolicyTableQuery,
} from './policy-table.schema'

export type WorkspacePolicyTableClientService = Pick<
  WorkspacePolicyTableService,
  (typeof workspacePolicyTableMethods)[number]
>

export const workspacePolicyTablePath = SERVICES.WORKSPACE_POLICY_TABLE

export const workspacePolicyTableMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspacePolicyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspacePolicyTablePath, connection.service(workspacePolicyTablePath), {
    methods: workspacePolicyTableMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspacePolicyTablePath]: WorkspacePolicyTableClientService
  }
}
