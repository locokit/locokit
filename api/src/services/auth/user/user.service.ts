import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import type { Application } from '../../../declarations'
import type { UserData, UserResult, UserQuery } from './user.schema'
import { hooks } from './user.hooks'
import { API_PATH } from '@locokit/definitions'
import { userDataSchema, userQuerySchema, userSchema } from './user.schema'
import { createSwaggerServiceOptions } from 'feathers-swagger'

export interface UserParams extends KnexAdapterParams<UserQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService extends KnexService<
  UserResult,
  UserData,
  UserParams
> {}

// A configure function that registers the service and its hooks via `app.configure`
export function user(app: Application): void {
  const options = {
    // Service options will go here
    paginate: app.get('paginate'),
    Model: app.get('db'),
    name: 'user',
  }

  // Register our service on the Feathers application
  app.use(API_PATH.AUTH.USER, new UserService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { userDataSchema, userQuerySchema, userSchema },
      docs: { description: 'User service' },
    }),
  })
  // Initialize hooks
  app.service(API_PATH.AUTH.USER).hooks(hooks)
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.AUTH.USER]: UserService
  }
}
