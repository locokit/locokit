// Initializes the `authmanagement` service on path `/authmanagement`
// import { Service, ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { hooks } from './authmanagement.hooks'
import { AuthenticationManagementService } from 'feathers-authentication-management'
import { authManagementSettings } from './authmanagement.settings'
import { SERVICES } from '@locokit/definitions'
import { ServiceSwaggerOptions } from 'feathers-swagger'

declare module 'feathers-authentication-management' {
  class AuthenticationManagementService {
    docs: ServiceSwaggerOptions
  }
}
export function authmanagement(app: Application): void {
  const authenticationManagementService = new AuthenticationManagementService(
    app,
    authManagementSettings(app),
  )
  authenticationManagementService.docs = {
    schemas: {
      authManagementRequest: {
        type: 'object',
        required: ['action'],

        properties: {
          action: {
            type: 'string',
            description:
              'The action the user want to do (see https://github.com/feathersjs-ecosystem/feathers-authentication-management/blob/master/docs.md#using-feathers-method-calls)',
            enum: [
              'resendVerifySignup',
              'passwordChange',
              'identityChange',
              'verifySignupSetPasswordLong',
              'verifySignupSetPasswordShort',
              'resetPwdLong',
              'resetPwdShort',
            ],
          },
        },
      },
    },
    description: `
This service allow users to sign up, renew their lost password, ...
Please check [the feathers auth management doc°](https://github.com/feathersjs-ecosystem/feathers-authentication-management/blob/master/docs.md#using-feathers-method-calls).
`,
  }

  app.use(SERVICES.AUTH_MANAGEMENT, authenticationManagementService)

  // Get our initialized service so that we can register hooks and filters
  const service = app.service(SERVICES.AUTH_MANAGEMENT)

  service.hooks(hooks)
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [SERVICES.AUTH_MANAGEMENT]: AuthenticationManagementService
  }
}
