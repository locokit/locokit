// Initializes the `authmanagement` service on path `/authmanagement`
// import { Service, ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { hooks } from './authmanagement.hooks'
import { AuthenticationManagementService } from 'feathers-authentication-management'
import { authManagementSettings } from './authmanagement.settings'

export function authmanagement(app: Application): void {
  app.use(
    'auth-management',
    new AuthenticationManagementService(app, authManagementSettings(app)),
  )
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('auth-management')

  service.hooks(hooks)
}
// ;(app): void {
//   app.configure(
//     authManagement(authManagementSettings(app), {
//       tag: 'authManagement',
//       description: `
// This service allow users to sign up, renew their lost password, ...
// Please check [the feathers auth management doc°](https://github.com/feathersjs-ecosystem/feathers-authentication-management/blob/master/docs.md#using-feathers-method-calls).
// `,
//       definition: {
//         title: 'AuthManagement',
//         type: 'object',
//         required: ['action'],

//         properties: {
//           action: {
//             type: 'string',
//             description:
//               'The action the user want to do (see https://github.com/feathersjs-ecosystem/feathers-authentication-management/blob/master/docs.md#using-feathers-method-calls)',
//             enum: [
//               'resendVerifySignup',
//               'passwordChange',
//               'identityChange',
//               'verifySignupSetPasswordLong',
//               'verifySignupSetPasswordShort',
//               'resetPwdLong',
//               'resetPwdShort',
//             ],
//           },
//         },
//       },
//     }),
//   )

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'auth-management': AuthenticationManagementService
  }
}
