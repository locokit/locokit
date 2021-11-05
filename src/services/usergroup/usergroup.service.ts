// Initializes the `usergroup` service on path `/usergroup`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Usergroup } from './usergroup.class'
import createModel from '../../models/usergroup.model'
import hooks from './usergroup.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'usergroup': Usergroup & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    id: ['user_id', 'group_id'],
  }

  // Initialize our service with any options it requires
  app.use('/usergroup', new Usergroup(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('usergroup')

  service.hooks(hooks)
}
