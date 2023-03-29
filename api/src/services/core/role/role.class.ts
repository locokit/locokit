import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { RoleData, RoleResult, RoleQuery, roleDataValidator } from './role.schema'
import { roleQueryValidator, roleResolvers } from './role.resolver'
import { Application, HookContext } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { UserResult } from '../../core/user/user.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'
import { HookMap } from '@feathersjs/feathers'

export const roleHooks: HookMap<Application, RoleService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(roleResolvers.dispatch),
      schemaHooks.resolveResult(roleResolvers.result),
    ],
  },
  before: {
    find: [
      schemaHooks.validateQuery(roleQueryValidator),
      schemaHooks.resolveQuery(roleResolvers.query),
    ],
    create: [
      schemaHooks.validateData(roleDataValidator),
      schemaHooks.resolveData(roleResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === USER_PROFILE.MEMBER)
          throw new Forbidden("You don't have sufficient privilege to create a role.")
      },
    ],
  },
  after: {
    find: [schemaHooks.resolveData(roleResolvers.result)],
  },
  error: {},
}

export interface RoleParams extends KnexAdapterParams<RoleQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class RoleService extends ObjectionService<RoleResult, RoleData, RoleParams> {}
