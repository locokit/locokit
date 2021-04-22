// Initializes the `workspace` service on path `/workspace`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Workspace } from './workspace.class'
import createModel from '../../models/workspace.model'
import hooks from './workspace.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'workspace': Workspace & ServiceAddons<any>
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
      '$joinRelation',
      '$modifyEager',
    ],
    allowedEager: '[attachments, databases, chapters.[pages.[containers.[blocks]]], processes.[triggers], groups.[users]]',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/workspace', new Workspace(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('workspace')

  service.hooks(hooks)
}
