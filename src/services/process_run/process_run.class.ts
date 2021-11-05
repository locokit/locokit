import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
import { ProcessRun as ProcessRunModel } from '../../models/process_run.model'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class ProcessRun extends Service<ProcessRunModel> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })
  }
}
