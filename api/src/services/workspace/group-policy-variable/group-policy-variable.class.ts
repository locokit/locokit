import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  WorkspaceGroupPolicyVariableData,
  WorkspaceGroupPolicyVariableResult,
  WorkspaceGroupPolicyVariableQuery,
  workspaceGroupPolicyVariableDataValidator,
} from './group-policy-variable.schema'
import {
  workspaceGroupPolicyVariableQueryValidator,
  workspaceGroupPolicyVariableResolvers,
} from './group-policy-variable.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService, transaction } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { setLocoKitContext } from '@/hooks/locokit'

export const workspaceGroupPolicyVariableHooks: HookMap<
  Application,
  WorkspaceGroupPolicyVariableService
> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspaceGroupPolicyVariableResolvers.dispatch),
      schemaHooks.resolveResult(workspaceGroupPolicyVariableResolvers.result),
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
      schemaHooks.validateQuery(workspaceGroupPolicyVariableQueryValidator),
      schemaHooks.resolveQuery(workspaceGroupPolicyVariableResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspaceGroupPolicyVariableDataValidator),
      schemaHooks.resolveData(workspaceGroupPolicyVariableResolvers.data.create),
    ],
  },
  after: {
    find: [
      // schemaHooks.resolveData(workspaceGroupPolicyVariableResolvers.result),
      transaction.end(),
    ],
  },
  error: {
    all: [transaction.rollback()],
  },
}

export interface WorkspaceGroupPolicyVariableParams
  extends KnexAdapterParams<WorkspaceGroupPolicyVariableQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceGroupPolicyVariableService extends ObjectionService<
  WorkspaceGroupPolicyVariableResult,
  WorkspaceGroupPolicyVariableData,
  WorkspaceGroupPolicyVariableParams
> {}
