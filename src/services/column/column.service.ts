import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Column } from './column.class';
import createModel from '../../models/column.model';
import hooks from './column.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'column': Column & ServiceAddons<any>;
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
  app.use('/column', new Column(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('column');

  service.hooks(hooks);
}
