// Initializes the `chapter` service on path `/chapter`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Log } from './log.class'
import createModel from '../../models/log.model'
import hooks from './log.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'log': Log & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    allowedEager: '[user,record,field]',
    multi: ['patch', 'remove'],
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
      '$noSelect',
    ],
  }

  // Initialize our service with any options it requires
  app.use('/log', new Log(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('log')

  service.hooks(hooks)
}
