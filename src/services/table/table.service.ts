// Initializes the `table` service on path `/table`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Table } from './table.class';
import createModel from '../../models/table.model';
import hooks from './table.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'table': Table & ServiceAddons<any>;
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
    allowedEager: 'columns',
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/table', new Table(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('table');

  service.hooks(hooks);
}
