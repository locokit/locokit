// Initializes the `block` service on path `/block`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Block } from './block.class'
import createModel from '../../models/block.model'
import hooks from './block.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'block': Block & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/block', new Block(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('block')

  service.hooks(hooks)
}
