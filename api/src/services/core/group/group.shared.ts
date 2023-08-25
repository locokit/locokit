// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { GroupService } from './group.class'
export type { GroupData, GroupPatch, GroupQuery } from './group.schema'

export type GroupClientService = Pick<GroupService, (typeof groupMethods)[number]>

export const groupPath = SERVICES.CORE_GROUP

export const groupMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const groupClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(groupPath, connection.service(groupPath), {
    methods: groupMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [groupPath]: GroupClientService
  }
}
