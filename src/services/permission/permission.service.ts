// Initializes the `permission` service on path `/permission`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Permission } from './permission.class';
import createModel from '../../models/permission.model';
import hooks from './permission.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'permission': Permission & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/permission', new Permission(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('permission');

  service.hooks(hooks);
}
