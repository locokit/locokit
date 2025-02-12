// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { UserGroupService } from './user-group.class'
export type {
  UserGroupData,
  UserGroupPatch,
  UserGroupQuery,
  UserGroupResult,
} from './user-group.schema'

export type UserGroupClientService = Pick<UserGroupService, (typeof userGroupMethods)[number]>

export const userGroupPath = SERVICES.CORE_USERGROUP

export const userGroupMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const userGroupClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(userGroupPath, connection.service(userGroupPath), {
    methods: userGroupMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [userGroupPath]: UserGroupClientService
  }
}
