// Initializes the `authmanagement` service on path `/authmanagement`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import hooks from './authmanagement.hooks'
import authManagement from 'feathers-authentication-management'
import { accountService } from './notifier'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'authManagement': ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  app.configure(authManagement(accountService(app)))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement')

  service.hooks(hooks)
}
