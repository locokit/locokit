import { Application } from '@/declarations'
import { hooks } from './authmanagement.hooks'
import { AuthenticationManagementService } from 'feathers-authentication-management'
import { authManagementSettings } from './authmanagement.settings'
import { SERVICES } from '@locokit/definitions'
import type { ServiceSwaggerOptions } from 'feathers-swagger'
import { authManagementDataSchema } from './authmanagement.schema'
import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg

declare module 'feathers-authentication-management' {
  class AuthenticationManagementService {
    docs: ServiceSwaggerOptions
  }
}

export function authmanagement(app: Application): void {
  app.use(
    SERVICES.AUTH_MANAGEMENT,
    new AuthenticationManagementService(app, authManagementSettings(app)),
    {
      methods: ['create'],
      events: [],
      docs: createSwaggerServiceOptions({
        schemas: { createRequest: authManagementDataSchema },
        docs: {
          description: `
This service allow users to sign up, renew their lost password, ...
Please check [the feathers auth management doc°](https://feathers-a-m.netlify.app/).
`,
          tag: 'auth > management',
        },
      }),
    },
  )

  // Get our initialized service so that we can register hooks and filters
  const service = app.service(SERVICES.AUTH_MANAGEMENT)

  service.hooks(hooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.AUTH_MANAGEMENT]: AuthenticationManagementService
  }
}
