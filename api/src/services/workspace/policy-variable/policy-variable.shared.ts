// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { WorkspacePolicyVariableService } from './policy-variable.class'
export type {
  WorkspacePolicyVariableData,
  WorkspacePolicyVariablePatch,
  WorkspacePolicyVariableResult,
  WorkspacePolicyVariableQuery,
} from './policy-variable.schema'

export type WorkspacePolicyVariableClientService = Pick<
  WorkspacePolicyVariableService,
  (typeof workspacePolicyVariableMethods)[number]
>

export const workspacePolicyVariablePath = SERVICES.WORKSPACE_POLICY_VARIABLE

export const workspacePolicyVariableMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspacePolicyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspacePolicyVariablePath, connection.service(workspacePolicyVariablePath), {
    methods: workspacePolicyVariableMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspacePolicyVariablePath]: WorkspacePolicyVariableClientService
  }
}
