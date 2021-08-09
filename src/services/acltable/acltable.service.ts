// Initializes the `acl` service on path `/acl`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { ServiceAclTable } from './acltable.class'
import createModel from '../../models/acltable.model'
import hooks from './acltable.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'acltable': ServiceAclTable & ServiceAddons<any>
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
    allowedEager: '[aclset]',
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/acltable', new ServiceAclTable(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('acltable')

  service.hooks(hooks)
}
