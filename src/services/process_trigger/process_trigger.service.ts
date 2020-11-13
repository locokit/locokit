// Initializes the `process_trigger` service on path `/process-trigger`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { ProcessTrigger } from './process_trigger.class'
import createModel from '../../models/process_trigger.model'
import hooks from './process_trigger.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'process-trigger': ProcessTrigger & ServiceAddons<any>;
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
      '$modifyEager'
    ],
    allowedEager: '[process, executions, table]',
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/process-trigger', new ProcessTrigger(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('process-trigger')

  service.hooks(hooks)
}
