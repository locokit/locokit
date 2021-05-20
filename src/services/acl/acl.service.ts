// Initializes the `acl` service on path `/acl`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Acl } from './acl.class'
import createModel from '../../models/acl.model'
import hooks from './acl.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'acl': Acl & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/acl', new Acl(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('acl')

  service.hooks(hooks)
}
