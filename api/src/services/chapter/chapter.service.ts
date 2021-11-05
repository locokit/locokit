// Initializes the `chapter` service on path `/chapter`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Chapter } from './chapter.class'
import createModel from '../../models/chapter.model'
import hooks from './chapter.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'chapter': Chapter & ServiceAddons<any>
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
    allowedEager: 'pages',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/chapter', new Chapter(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('chapter')

  service.hooks(hooks)
}
