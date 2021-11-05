// Initializes the `attachment` service on path `/attachment`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Attachment } from './attachment.class'
import createModel from '../../models/attachment.model'
import hooks from './attachment.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'attachment': Attachment & ServiceAddons<any>
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
      '$any',
      '$all',
      '$noSelect',
    ],
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/attachment', new Attachment(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('attachment')

  service.hooks(hooks)
}
