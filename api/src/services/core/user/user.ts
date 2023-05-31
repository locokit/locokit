import { ObjectionAdapterOptions } from '@/feathers-objection'
import type { Application } from '@/declarations'
import { hooks } from './user.hooks'
import { SERVICES } from '@locokit/definitions'
import { UserService } from './user.class'
import { userDataSchema, userQuerySchema, userSchema } from './user.schema'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { UserModel } from './user.model'

// A configure function that registers the service and its hooks via `app.configure`
export function user(app: Application): void {
  const options: ObjectionAdapterOptions = {
    // Service options will go here
    paginate: app.get('paginate'),
    Model: UserModel,
    name: 'lck_user',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_USER, new UserService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'patch'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { userDataSchema, userQuerySchema, userSchema },
      docs: { description: 'User service', tag: 'core > user' },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_USER).hooks(hooks)
}
// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_USER]: UserService
  }
}
