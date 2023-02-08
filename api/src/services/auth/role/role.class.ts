import { KnexAdapterParams } from '@feathersjs/knex'
import {
  resolveData,
  resolveQuery,
  resolveAll,
  validateQuery,
  validateData,
} from '@feathersjs/schema'

import { RoleData, RoleResult, RoleQuery, roleDataValidator } from './role.schema'
import { roleQueryValidator, roleResolvers } from './role.resolver'
import { HookContext } from '../../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../../feathers-objection'
import { UserResult } from '../user/user.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'

export const roleHooks = {
  around: {
    all: [authenticate('jwt'), validateData(roleDataValidator), resolveAll(roleResolvers)],
  },
  before: {
    find: [validateQuery(roleQueryValidator), resolveQuery(roleResolvers.query)],
    create: [
      resolveData(roleResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === USER_PROFILE.MEMBER)
          throw new Forbidden("You don't have sufficient privilege to create a role.")
      },
    ],
  },
  after: {
    find: [resolveData(roleResolvers.result)],
  },
  error: {},
}

export interface RoleParams extends KnexAdapterParams<RoleQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RoleService extends ObjectionService<RoleResult, RoleData, RoleParams> {}
