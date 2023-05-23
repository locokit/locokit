import { KnexAdapterParams } from '@feathersjs/knex'
import {
  resolveData,
  resolveQuery,
  resolveAll,
  validateQuery,
  validateData,
} from '@feathersjs/schema'

import {
  GroupData,
  GroupResult,
  GroupQuery,
  groupDataValidator,
  groupQueryValidator,
} from './group.schema'
import { groupResolvers } from './group.resolver'
import { HookContext } from '../../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../../feathers-objection'
import { UserResult } from '../../auth/user/user.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'

export const groupHooks = {
  around: {
    all: [authenticate('jwt'), validateData(groupDataValidator), resolveAll(groupResolvers)],
  },
  before: {
    find: [validateQuery(groupQueryValidator), resolveQuery(groupResolvers.query)],
    create: [
      resolveData(groupResolvers.data.create),
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

export interface GroupParams extends KnexAdapterParams<GroupQuery> {}

// By default, calls the standard Knex adapter service methods but can be customized with your own functionality.
export class GroupService extends ObjectionService<GroupResult, GroupData, GroupParams> {}
