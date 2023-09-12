import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '@/declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { GroupService, groupHooks } from './group.class'
import { GroupModel } from './group.model'
import { groupDataSchema, groupQuerySchema, groupSchema } from './group.schema'
import { groupMethods, groupPath } from './group.shared'

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
  app.use(groupPath, new GroupService(options), {
    // A list of all methods this service exposes externally
    methods: groupMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { groupDataSchema, groupQuerySchema, groupSchema },
      docs: { description: 'Group service', tag: 'core > group' },
    }),
  })
  // Initialize hooks
  app.service(groupPath).hooks(groupHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [groupPath]: GroupService
  }
}
