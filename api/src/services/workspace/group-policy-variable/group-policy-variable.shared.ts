// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { WorkspaceGroupPolicyVariableService } from './group-policy-variable.class'
export type {
  WorkspaceGroupPolicyVariableData,
  WorkspaceGroupPolicyVariablePatch,
  WorkspaceGroupPolicyVariableResult,
  WorkspaceGroupPolicyVariableQuery,
} from './group-policy-variable.schema'

export type WorkspaceGroupPolicyVariableClientService = Pick<
  WorkspaceGroupPolicyVariableService,
  (typeof workspaceGroupPolicyVariableMethods)[number]
>

export const workspaceGroupPolicyVariablePath = SERVICES.WORKSPACE_GROUP_POLICY_VARIABLE

export const workspaceGroupPolicyVariableMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const

export const workspaceGroupPolicyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(
    workspaceGroupPolicyVariablePath,
    connection.service(workspaceGroupPolicyVariablePath),
    {
      methods: workspaceGroupPolicyVariableMethods,
    },
  )
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspaceGroupPolicyVariablePath]: WorkspaceGroupPolicyVariableClientService
  }
}
