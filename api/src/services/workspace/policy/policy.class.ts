import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  WorkspacePolicyData,
  WorkspacePolicyResult,
  WorkspacePolicyQuery,
  workspacePolicyDataValidator,
  workspacePolicyDataInternalValidator,
  workspacePolicyPatchValidator,
} from './policy.schema'
import { workspacePolicyQueryValidator, workspacePolicyResolvers } from './policy.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService, transaction } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { setLocoKitContext } from '@/hooks/locokit'

export const workspacePolicyHooks: HookMap<Application, WorkspacePolicyService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspacePolicyResolvers.dispatch),
      schemaHooks.resolveResult(workspacePolicyResolvers.result),
    ],
  },
  before: {
    all: [
      checkUserHasAccess({
        allowedProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      }),
      transaction.start(),
      setLocoKitContext,
    ],
    find: [
      schemaHooks.validateQuery(workspacePolicyQueryValidator),
      schemaHooks.resolveQuery(workspacePolicyResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspacePolicyDataValidator),
      schemaHooks.resolveData(workspacePolicyResolvers.data.create),
      schemaHooks.validateData(workspacePolicyDataInternalValidator),
    ],
    patch: [
      schemaHooks.resolveData(workspacePolicyResolvers.data.patch),
      schemaHooks.validateData(workspacePolicyPatchValidator),
    ],
  },
  after: {
    find: [schemaHooks.resolveData(workspacePolicyResolvers.result), transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}

export interface WorkspacePolicyParams extends KnexAdapterParams<WorkspacePolicyQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspacePolicyService extends ObjectionService<
  WorkspacePolicyResult,
  WorkspacePolicyData,
  WorkspacePolicyParams
> {}
