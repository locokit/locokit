import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { PolicyData, PolicyResult, PolicyQuery, policyDataValidator } from './policy.schema'
import { policyQueryValidator, policyResolvers } from './policy.resolver'
import { Application, HookContext } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { UserResult } from '@/services/core/user/user.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'
import { HookMap } from '@feathersjs/feathers'

export const policyHooks: HookMap<Application, PolicyService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(policyResolvers.dispatch),
      schemaHooks.resolveResult(policyResolvers.result),
    ],
  },
  before: {
    find: [
      schemaHooks.validateQuery(policyQueryValidator),
      schemaHooks.resolveQuery(policyResolvers.query),
    ],
    create: [
      schemaHooks.validateData(policyDataValidator),
      schemaHooks.resolveData(policyResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === USER_PROFILE.MEMBER)
          throw new Forbidden("You don't have sufficient privilege to create a policy.")
      },
    ],
  },
  after: {
    find: [schemaHooks.resolveData(policyResolvers.result)],
  },
  error: {},
}

export interface PolicyParams extends KnexAdapterParams<PolicyQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PolicyService extends ObjectionService<PolicyResult, PolicyData, PolicyParams> {}
