// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { ClientApplication } from '@/client'
import { SERVICES } from '@locokit/definitions'
import type { SignUpService } from './signup.class'
export type { SignUpData } from './signup.schema'

export type SignupClientService = Pick<SignUpService, (typeof signupMethods)[number]>

export const signupPath = SERVICES.AUTH_SIGNUP

export const signupMethods = ['create'] as const

export const signupClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(signupPath, connection.service(signupPath), {
    methods: signupMethods,
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [signupPath]: SignupClientService
  }
}
