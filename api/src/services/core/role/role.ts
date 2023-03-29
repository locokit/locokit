import { SERVICES } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '../../../declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { RoleService, roleHooks } from './role.class'
import { RoleModel } from './role.model'
import { roleDataSchema, roleQuerySchema, roleSchema } from './role.schema'

// A configure function that registers the service and its hooks via `app.configure`
export function roleService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: RoleModel,
    name: 'lck_role',
    schema: 'core',
    allowedGraph: '[workspace.owner,groups]',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_ROLE, new RoleService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { roleDataSchema, roleQuerySchema, roleSchema },
      docs: { description: 'Role service' },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_ROLE).hooks(roleHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_ROLE]: RoleService
  }
}
