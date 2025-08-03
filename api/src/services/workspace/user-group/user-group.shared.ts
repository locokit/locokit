// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/shared'
import type { WorkspaceUserGroupService } from './user-group.class'
export type {
  UserGroupData,
  UserGroupPatch,
  UserGroupQuery,
  UserGroupResult,
} from './user-group.schema'

export type UserGroupClientService = Pick<
  WorkspaceUserGroupService,
  (typeof workspaceUserGroupMethods)[number]
>

export const workspaceUserGroupPath = SERVICES.WORKSPACE_USERGROUP

export const workspaceUserGroupMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspaceUserGroupClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspaceUserGroupPath, connection.service(workspaceUserGroupPath), {
    methods: workspaceUserGroupMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspaceUserGroupPath]: UserGroupClientService
  }
}
