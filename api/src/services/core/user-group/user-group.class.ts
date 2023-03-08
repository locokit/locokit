import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  UserGroupData,
  UserGroupResult,
  UserGroupQuery,
  userGroupDataValidator,
} from './user-group.schema'
import { userGroupQueryValidator, userGroupResolvers } from './user-group.resolver'
import { Application, HookContext } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { UserResult } from '../../auth/user/user.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'
import { HookMap } from '@feathersjs/feathers'

export const userGroupHooks: HookMap<Application, UserGroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.validateData(userGroupDataValidator),
      schemaHooks.resolveExternal(userGroupResolvers.dispatch),
      schemaHooks.resolveResult(userGroupResolvers.result),
    ],
  },
  before: {
    find: [
      schemaHooks.validateQuery(userGroupQueryValidator),
      schemaHooks.resolveQuery(userGroupResolvers.query),
    ],
    create: [
      schemaHooks.resolveData(userGroupResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === USER_PROFILE.MEMBER)
          throw new Forbidden("You don't have sufficient privilege to create a group.")
      },
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
