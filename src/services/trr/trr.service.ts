// Initializes the `trr` service on path `/trr`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Trr } from './trr.class'
import createModel from '../../models/tablerowrelation.model'
import hooks from './trr.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'trr': Trr & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    id: ['table_row_to_id', 'table_column_to_id'],
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: [
      '$eq',
      '$ne',
      '$gte',
      '$gt',
      '$lte',
      '$lt',
      '$in',
      '$nin',
      '$null',
      '$notNull',
      '$like',
      '$notLike',
      '$ilike',
      '$notILike',
      '$contains',
      '$containsKey',
      '$or',
      '$and',
      '$sort',
      '$eager',
      '$any'
    ],
    allowedEager: '[from, to]',
    multi: ['remove'],
  }

  // Initialize our service with any options it requires
  app.use('/trr', new Trr(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('trr')

  service.hooks(hooks)
}
