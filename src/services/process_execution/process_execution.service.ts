// Initializes the `process_execution` service on path `/process-execution`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { ProcessExecution } from './process_execution.class'
import createModel from '../../models/process_execution.model'
import hooks from './process_execution.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'process-execution': ProcessExecution & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  }

  // Initialize our service with any options it requires
  app.use('/process-execution', new ProcessExecution(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('process-execution')

  service.hooks(hooks)
}
