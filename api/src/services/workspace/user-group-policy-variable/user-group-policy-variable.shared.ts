// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { WorkspaceUserGroupPolicyVariableService } from './user-group-policy-variable.class'
export type {
  UserGroupPolicyVariableData,
  UserGroupPolicyVariablePatch,
  UserGroupPolicyVariableQuery,
  UserGroupPolicyVariableResult,
} from './user-group-policy-variable.schema'

export type UserGroupClientService = Pick<
  WorkspaceUserGroupPolicyVariableService,
  (typeof workspaceUserGroupPolicyVariableMethods)[number]
>

export const workspaceUserGroupPolicyVariablePath = SERVICES.WORKSPACE_USERGROUP_POLICY_VARIABLE

export const workspaceUserGroupPolicyVariableMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const

export const workspaceUserGroupPolicyVariableClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(
    workspaceUserGroupPolicyVariablePath,
    connection.service(workspaceUserGroupPolicyVariablePath),
    {
      methods: workspaceUserGroupPolicyVariableMethods,
    },
  )
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspaceUserGroupPolicyVariablePath]: UserGroupClientService
  }
}
