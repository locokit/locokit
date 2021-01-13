// Initializes the `container` service on path `/container`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Container } from './container.class'
import createModel from '../../models/container.model'
import hooks from './container.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'container': Container & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/container', new Container(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('container')

  service.hooks(hooks)
}
