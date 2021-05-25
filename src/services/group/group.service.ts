// Initializes the `group` service on path `/group`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Group } from './group.class'
import createModel from '../../models/group.model'
import hooks from './group.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'group': Group & ServiceAddons<any>
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
      '$modifyEager',
      '$joinRelation',
      '$joinRelated',
      '$joinEager',
    ],
    allowedEager: '[users, usergroups, aclset.[workspace.[chapters], chapter]]',
    allowedInsert: 'users',
    insertGraphOptions: {
      relate: true,
    },
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/group', new Group(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('group')

  service.hooks(hooks)
}
