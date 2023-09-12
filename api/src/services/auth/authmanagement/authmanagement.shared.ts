// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { AuthenticationManagementService } from 'feathers-authentication-management'

export type AuthManagementClientService = Pick<
  AuthenticationManagementService,
  (typeof authManagementMethods)[number]
>

export const authManagementPath = SERVICES.AUTH_MANAGEMENT

export const authManagementMethods = ['create'] as const

export const authManagementClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(authManagementPath, connection.service(authManagementPath), {
    methods: authManagementMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [authManagementPath]: AuthManagementClientService
  }
}
