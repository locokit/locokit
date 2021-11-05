import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { Group } from '../../models/group.model'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class GroupService extends Service {
  public docs: ServiceSwaggerOptions

  constructor (options: Partial<Options>) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })

    this.docs = {
      description: 'A service to send and receive groups',
      definition: Group.jsonSchema,
      securities: ['all'],
      definitions: Group.jsonSchema.definitions,
      // refs: {
      //   createRequest: 'userRequest',
      // },
    }
  }
}
