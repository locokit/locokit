// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import { AuthenticationService } from '@feathersjs/authentication'

export type AuthenticationClientService = Pick<
  AuthenticationService,
  (typeof authenticationMethods)[number]
>

export const authenticationPath = SERVICES.AUTH_AUTHENTICATION

export const authenticationMethods = ['create'] as const

export const authenticationClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(authenticationPath, connection.service(authenticationPath), {
    methods: authenticationMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [authenticationPath]: AuthenticationService
  }
}
