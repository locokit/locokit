// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { UserService } from './user.class'
export type { User, UserData, UserPatch, UserQuery, UserResult } from './user.schema'

export type UserClientService = Pick<UserService, (typeof userMethods)[number]>

export const userPath = SERVICES.CORE_USER

export const userMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const userClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(userPath, connection.service(userPath), {
    methods: userMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [userPath]: UserClientService
  }
}
