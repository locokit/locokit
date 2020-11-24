import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
import { ProcessExecution as ProcessExecutionModel } from '../../models/process_execution.model'

interface Options extends ObjectionServiceOptions {
  Model: any;
}

export class ProcessExecution extends Service<ProcessExecutionModel> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model
    })
  }
}
