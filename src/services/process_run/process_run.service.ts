// Initializes the `process_run` service on path `/process-run`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { ProcessRun } from './process_run.class'
import createModel from '../../models/process_run.model'
import hooks from './process_run.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'process-run': ProcessRun & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  }

  // Initialize our service with any options it requires
  app.use('/process-run', new ProcessRun(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('process-run')

  service.hooks(hooks)
}
