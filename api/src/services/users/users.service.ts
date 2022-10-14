import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type { UsersData, UsersResult, UsersQuery } from './users.schema'
import { hooks } from './users.hooks'

export interface UsersParams extends KnexAdapterParams<UsersQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UsersService extends KnexService<
  UsersResult,
  UsersData,
  UsersParams
> {}

// A configure function that registers the service and its hooks via `app.configure`
export function users(app: Application): void {
  const options = {
    // Service options will go here
    paginate: app.get('paginate'),
    Model: app.get('db'),
    name: 'users',
  }

  // Register our service on the Feathers application
  app.use('users', new UsersService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service('users').hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    users: UsersService
  }
}
