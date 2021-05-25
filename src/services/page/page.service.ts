// Initializes the `page` service on path `/page`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Page } from './page.class'
import createModel from '../../models/page.model'
import hooks from './page.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'page': Page & ServiceAddons<any>
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
      '$any',
      '$eager',
    ],
    allowedEager: '[containers.[blocks]]',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/page', new Page(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('page')

  service.hooks(hooks)
}
