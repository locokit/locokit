// Initializes the `database` service on path `/database`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Database } from './database.class'
import createModel from '../../models/database.model'
import hooks from './database.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'database': Database & ServiceAddons<any>
  }
}

export default function (app: Application): void {
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
      '$eager',
      '$any',
      '$joinRelation',
      '$joinEager',
      '$modifyEager',
    ],
    allowedEager: '[tables.[columns, rows, views.[columns]]]',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/database', new Database(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('database')

  service.hooks(hooks)
}
