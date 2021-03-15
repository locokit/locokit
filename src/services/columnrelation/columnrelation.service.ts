// Initializes the `columnrelation` service on path `/columnrelation`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Columnrelation } from './columnrelation.class'
import createModel from '../../models/tablecolumnrelation.model'
import hooks from './columnrelation.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'columnrelation': Columnrelation & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    id: ['table_column_from_id', 'table_column_to_id'],
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
      '$any',
    ],
    Model: createModel(app),
    paginate: app.get('paginate'),
    allowedEager: '[from, to]',
    multi: true,
  }

  // Initialize our service with any options it requires
  app.use('/columnrelation', new Columnrelation(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('columnrelation')

  service.hooks(hooks)
}
