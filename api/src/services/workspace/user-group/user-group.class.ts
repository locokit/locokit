import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  UserGroupData,
  UserGroupResult,
  UserGroupQuery,
  workspaceUserGroupDataValidator,
  workspaceUserGroupPatchValidator,
  workspaceUserGroupQueryValidator,
} from './user-group.schema'
import { workspaceUserGroupResolvers } from './user-group.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'

export const workspaceUserGroupHooks: HookMap<Application, WorkspaceUserGroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspaceUserGroupResolvers.dispatch),
      schemaHooks.resolveResult(workspaceUserGroupResolvers.result),
    ],
  },
  before: {
    all: [
      checkUserHasAccess({
        allowedProfile: [USER_PROFILE.ADMIN, USER_PROFILE.CREATOR],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      }),
    ],
    find: [
      schemaHooks.validateQuery(workspaceUserGroupQueryValidator),
      schemaHooks.resolveQuery(workspaceUserGroupResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspaceUserGroupDataValidator),
      schemaHooks.resolveData(workspaceUserGroupResolvers.data.create),
    ],
    patch: [
      schemaHooks.validateData(workspaceUserGroupPatchValidator),
      schemaHooks.resolveData(workspaceUserGroupResolvers.data.patch),
    ],
    update: [
      schemaHooks.validateData(workspaceUserGroupDataValidator),
      schemaHooks.resolveData(workspaceUserGroupResolvers.data.update),
    ],
  },
  after: {},
  error: {},
}

export interface UserGroupParams extends KnexAdapterParams<UserGroupQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceUserGroupService extends ObjectionService<
  UserGroupResult,
  UserGroupData,
  UserGroupParams
> {}
