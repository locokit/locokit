// Initializes the `view` service on path `/view`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { View } from './view.class'
import createModel from '../../models/tableview.model'
import hooks from './view.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'view': View & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    whitelist: [
      '$eq',
      '$ne',
      '$gte',
      '$gt',
      '$lte',
      '$lt',
      '$in',
      '$nin',
      '$like',
      '$notLike',
      '$ilike',
      '$notILike',
      '$contains',
      '$or',
      '$and',
      '$sort',
      '$any',
      '$eager',
      '$modifyEager'
    ],
    allowedEager: '[columns.[column_type], rows]',
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/view', new View(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('view')

  service.hooks(hooks)
}
