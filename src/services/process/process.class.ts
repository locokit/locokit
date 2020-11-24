import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
import { Process as ProcessModel } from '../../models/process.model'

interface Options extends ObjectionServiceOptions {
  Model: any;
}

export class Process extends Service<ProcessModel> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model
    })
  }
}
