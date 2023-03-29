import { SERVICES } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '../../../declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { GroupService, groupHooks } from './group.class'
import { GroupModel } from './group.model'
import { groupDataSchema, groupQuerySchema, groupSchema } from './group.schema'

// A configure function that registers the service and its hooks via `app.configure`
export function groupService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: GroupModel,
    name: 'lck_group',
    schema: 'core',
    allowedGraph: '[workspace.owner,users,policy]',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.CORE_GROUP, new GroupService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { groupDataSchema, groupQuerySchema, groupSchema },
      docs: { description: 'Group service' },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.CORE_GROUP).hooks(groupHooks)
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [SERVICES.CORE_GROUP]: GroupService
  }
}
