import { KnexAdapterParams } from '@feathersjs/knex'
import {
  resolveData,
  resolveQuery,
  resolveAll,
  validateQuery,
  validateData,
} from '@feathersjs/schema'

import {
  UserGroupData,
  UserGroupResult,
  UserGroupQuery,
  userGroupDataValidator,
} from './user-group.schema'
import { userGroupQueryValidator, userGroupResolvers } from './user-group.resolver'
import { HookContext } from '../../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../../feathers-objection'
import { UserResult } from '../user/user.schema'
import { PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'

export const userGroupHooks = {
  around: {
    all: [
      authenticate('jwt'),
      validateData(userGroupDataValidator),
      resolveAll(userGroupResolvers),
    ],
  },
  before: {
    find: [validateQuery(userGroupQueryValidator), resolveQuery(userGroupResolvers.query)],
    create: [
      resolveData(userGroupResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === PROFILE.MEMBER)
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
