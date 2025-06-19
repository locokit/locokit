import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  WorkspacePolicyVariableData,
  WorkspacePolicyVariableResult,
  WorkspacePolicyVariableQuery,
  workspacePolicyVariableDataValidator,
  workspacePolicyVariablePatchValidator,
} from './policy-variable.schema'
import {
  workspacePolicyVariableQueryValidator,
  workspacePolicyVariableResolvers,
} from './policy-variable.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService, transaction } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { setLocoKitContext } from '@/hooks/locokit'

export const workspacePolicyVariableHooks: HookMap<Application, WorkspacePolicyVariableService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspacePolicyVariableResolvers.dispatch),
      schemaHooks.resolveResult(workspacePolicyVariableResolvers.result),
    ],
  },
  before: {
    all: [
      transaction.start(),
      setLocoKitContext,
      // checkUserHasAccess({
      //   allowedProfile: [USER_PROFILE.ADMIN],
      //   internalProvider: true,
      //   internalProviderProfileCheck: 'IF_USER_PROVIDED',
      // }),
    ],
    find: [
      schemaHooks.validateQuery(workspacePolicyVariableQueryValidator),
      schemaHooks.resolveQuery(workspacePolicyVariableResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspacePolicyVariableDataValidator),
      schemaHooks.resolveData(workspacePolicyVariableResolvers.data.create),
    ],
    patch: [
      schemaHooks.validateData(workspacePolicyVariablePatchValidator),
      schemaHooks.resolveData(workspacePolicyVariableResolvers.data.patch),
    ],
  },
  after: {
    all: [transaction.end()],
    find: [schemaHooks.resolveData(workspacePolicyVariableResolvers.result)],
  },
  error: {
    all: [transaction.rollback()],
  },
}

export interface WorkspacePolicyVariableParams
  extends KnexAdapterParams<WorkspacePolicyVariableQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspacePolicyVariableService extends ObjectionService<
  WorkspacePolicyVariableResult,
  WorkspacePolicyVariableData,
  WorkspacePolicyVariableParams
> {}
