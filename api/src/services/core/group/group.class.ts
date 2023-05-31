import { KnexAdapterParams } from '@feathersjs/knex'
import { HookMap } from '@feathersjs/feathers'
import { ObjectionService } from '@/feathers-objection'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { Application, HookContext } from '@/declarations'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'

import {
  GroupData,
  GroupResult,
  GroupQuery,
  groupDataValidator,
  groupQueryValidator,
} from './group.schema'
import { groupResolvers } from './group.resolver'
import { authenticate } from '@feathersjs/authentication'
import { UserResult } from '@/services/core/user/user.schema'

export const groupHooks: HookMap<Application, GroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(groupResolvers.dispatch),
      schemaHooks.resolveResult(groupResolvers.result),
    ],
  },
  before: {
    find: [
      schemaHooks.validateQuery(groupQueryValidator),
      schemaHooks.resolveQuery(groupResolvers.query),
    ],
    create: [
      schemaHooks.validateData(groupDataValidator),
      schemaHooks.resolveData(groupResolvers.data.create),
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
