import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { Application } from '../../declarations'
import { LckAclSet } from '../../models/aclset.model'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class Acl extends Service {
  public docs: ServiceSwaggerOptions

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })

    this.docs = {
      description: `
This service give access to ACL set,
for a workspace and optionnaly a chapter.

Each group will have access to a workspace thanks to an ACL set.
`,
      definition: LckAclSet.jsonSchema,
    }
  }
}
