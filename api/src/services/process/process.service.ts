// Initializes the `process` service on path `/process`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Process } from './process.class'
import createModel from '../../models/process.model'
import hooks from './process.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'process': Process & ServiceAddons<any>
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
    allowedEager: '[runs, table]',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/process', new Process(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('process')

  service.hooks(hooks)
}
