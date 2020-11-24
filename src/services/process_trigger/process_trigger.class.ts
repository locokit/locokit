import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
import { ProcessTrigger as ProcessTriggerModel } from '../../models/process_trigger.model'

interface Options extends ObjectionServiceOptions {
  Model: any;
}

export class ProcessTrigger extends Service<ProcessTriggerModel> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model
    })
  }
}
