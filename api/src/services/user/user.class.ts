import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { Application } from '../../declarations'
import { User } from '../../models/user.model'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class UserService extends Service {
  public docs: ServiceSwaggerOptions

  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })

    this.docs = {
      description: 'A service to send and receive users',
      definition: User.jsonSchema,
      securities: ['all'],
      definitions: User.jsonSchema.definitions,
      refs: {
        createRequest: 'userRequest',
      },
    }
  }
}
