// Initializes the `row` service on path `/row`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Row } from './row.class';
import createModel from '../../models/row.model';
import hooks from './row.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'row': Row & ServiceAddons<any>;
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
      '$containsKey',
      '$or',
      '$and',
      '$sort',
      '$eager',
      '$any',
      '$joinRelation',
      '$joinEager',
      '$modifyEager',
    ],
    allowedEager: 'table',
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/row', new Row(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('row');

  service.hooks(hooks);
}
