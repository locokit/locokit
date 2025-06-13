// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { WorkspacePolicyTableFieldService } from './policy-table-field.class'
export type {
  WorkspacePolicyTableFieldData,
  WorkspacePolicyTableFieldPatch,
  WorkspacePolicyTableFieldResult,
  WorkspacePolicyTableFieldQuery,
} from './policy-table-field.schema'

export type WorkspacePolicyTableFieldClientService = Pick<
  WorkspacePolicyTableFieldService,
  (typeof workspacePolicyTableFieldMethods)[number]
>

export const workspacePolicyTableFieldPath = SERVICES.WORKSPACE_POLICY_TABLE_FIELD

export const workspacePolicyTableFieldMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const

export const workspacePolicyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspacePolicyTableFieldPath, connection.service(workspacePolicyTableFieldPath), {
    methods: workspacePolicyTableFieldMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspacePolicyTableFieldPath]: WorkspacePolicyTableFieldClientService
  }
}
