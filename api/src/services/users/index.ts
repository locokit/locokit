import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { resolveAll } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import type { Application, HookContext, NextFunction } from '../../declarations'
import type {
  UsersData,
  UsersResult,
  UsersQuery,
} from '../../schemas/users.schema'
import { usersResolvers } from '../../resolvers/users.resolver'

export interface UsersParams extends KnexAdapterParams<UsersQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UsersService extends KnexService<
UsersResult,
UsersData,
UsersParams
> {}

export const hooks = {
  around: {
    all: [],
    get: [authenticate('api-key', 'jwt'), resolveAll(usersResolvers)],
    find: [authenticate('api-key', 'jwt'), resolveAll(usersResolvers)],
    create: [resolveAll(usersResolvers)],
    patch: [authenticate('jwt', 'api-key'), resolveAll(usersResolvers)],
    update: [authenticate('jwt', 'api-key'), resolveAll(usersResolvers)],
    remove: [authenticate('jwt', 'api-key'), resolveAll(usersResolvers)],
  },
  before: {},
  after: {},
  error: {},
}

// A configure function that registers the service and its hooks via `app.configure`
export function users (app: Application) {
  const options = {
    // Service options will go here
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'users',
  }

  // Register our service on the Feathers application
  app.use('users', new UsersService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
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
