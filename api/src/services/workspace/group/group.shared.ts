// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { WorkspaceGroupService } from './group.class'
export type {
  WorkspaceGroupData,
  WorkspaceGroupPatch,
  WorkspaceGroupQuery,
  WorkspaceGroupResult,
} from './group.schema'

export type WorkspaceGroupClientService = Pick<
  WorkspaceGroupService,
  (typeof workspaceGroupMethods)[number]
>

export const workspaceGroupPath = SERVICES.WORKSPACE_GROUP

export const workspaceGroupMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const workspaceGroupClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(workspaceGroupPath, connection.service(workspaceGroupPath), {
    methods: workspaceGroupMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [workspaceGroupPath]: WorkspaceGroupClientService
  }
}
