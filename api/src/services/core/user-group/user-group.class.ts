import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  UserGroupData,
  UserGroupResult,
  UserGroupQuery,
  userGroupDataValidator,
  userGroupPatchValidator,
  userGroupQueryValidator,
} from './user-group.schema'
import { userGroupResolvers } from './user-group.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'

export const userGroupHooks: HookMap<Application, UserGroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(userGroupResolvers.dispatch),
      schemaHooks.resolveResult(userGroupResolvers.result),
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
      schemaHooks.validateQuery(userGroupQueryValidator),
      schemaHooks.resolveQuery(userGroupResolvers.query),
    ],
    create: [
      schemaHooks.validateData(userGroupDataValidator),
      schemaHooks.resolveData(userGroupResolvers.data.create),
    ],
    patch: [
      schemaHooks.validateData(userGroupPatchValidator),
      schemaHooks.resolveData(userGroupResolvers.data.patch),
    ],
    update: [
      schemaHooks.validateData(userGroupDataValidator),
      schemaHooks.resolveData(userGroupResolvers.data.update),
    ],
  },
  after: {},
  error: {},
}

export interface UserGroupParams extends KnexAdapterParams<UserGroupQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserGroupService extends ObjectionService<
  UserGroupResult,
  UserGroupData,
  UserGroupParams
> {}
