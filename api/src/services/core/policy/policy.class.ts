import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { PolicyData, PolicyResult, PolicyQuery, policyDataValidator } from './policy.schema'
import { policyQueryValidator, policyResolvers } from './policy.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'

export const policyHooks: HookMap<Application, PolicyService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(policyResolvers.dispatch),
      schemaHooks.resolveResult(policyResolvers.result),
    ],
  },
  before: {
    all: [
      checkUserHasAccess({
        userProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      }),
    ],
    find: [
      schemaHooks.validateQuery(policyQueryValidator),
      schemaHooks.resolveQuery(policyResolvers.query),
    ],
    create: [
      schemaHooks.validateData(policyDataValidator),
      schemaHooks.resolveData(policyResolvers.data.create),
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
