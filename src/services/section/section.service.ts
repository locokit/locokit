// Initializes the `section` service on path `/section`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Section } from './section.class';
import createModel from '../../models/section.model';
import hooks from './section.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'section': Section & ServiceAddons<any>;
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
    allowedEager: 'pages',
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/section', new Section(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('section');

  service.hooks(hooks);
}
