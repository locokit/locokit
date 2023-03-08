import { API_PATH } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import type { Application } from '../../../declarations'
import { ObjectionAdapterOptions } from '@/feathers-objection'

import { UserGroupService, userGroupHooks } from './user-group.class'
import { UserGroupModel } from './user-group.model'
import { userGroupDataSchema, userGroupQuerySchema, userGroupSchema } from './user-group.schema'

// A configure function that registers the service and its hooks via `app.configure`
export function userGroupService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: UserGroupModel,
    name: 'lck_userGroup',
    schema: 'core',
    allowedGraph: '[group,user]',
    id: ['userId', 'groupId'],
  }

  // Register our service on the Feathers application
  app.use(API_PATH.AUTH.USERGROUP, new UserGroupService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { userGroupDataSchema, userGroupQuerySchema, userGroupSchema },
      docs: { description: 'User-group service, association between user and group' },
    }),
  })
  // Initialize hooks
  app.service(API_PATH.AUTH.USERGROUP).hooks(userGroupHooks)
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.AUTH.USERGROUP]: UserGroupService
  }
}
