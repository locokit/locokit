// Initializes the `permission` service on path `/permission`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Permission } from './permission.class'
import hooks from './permission.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'permission': Permission & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use('/permission', new Permission(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('permission')

  service.hooks(hooks)
}
