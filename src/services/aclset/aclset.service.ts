// Initializes the `acl` service on path `/acl`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Acl } from './aclset.class'
import createModel from '../../models/aclset.model'
import hooks from './aclset.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'aclset': Acl & ServiceAddons<any>
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
      '$joinRelation',
      '$modifyEager',
    ],
    allowedEager: '[groups.[users], groupsacl.[users], acltables, workspace.[databases.[tables]]]',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/aclset', new Acl(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('aclset')

  service.hooks(hooks)
}
