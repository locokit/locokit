import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { Application } from '../../declarations'
import { User } from '../../models/user.model'

interface Options extends ObjectionServiceOptions {
  Model: any;
}

export class UserService extends Service {
  public docs: ServiceSwaggerOptions;

  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model
    })

    this.docs = {
      description: 'A service to send and receive users',
      operations: {
        get: {
          security: [{
            BearerAuth: []
          }],
          description: 'Retrieves a single resource with the given id from the service.',
          parameters: [{
            description: 'User id',
            in: 'path',
            required: true,
            name: 'id',
            schema: { type: 'integer' }
          }],
          responses: {
            200: {
              description: 'An user',
              content: {
                'application/json': {
                  schema: User.jsonSchema
                }
              }
            }
          }
        }
      }
    }
  }
}
