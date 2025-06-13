import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  WorkspacePolicyTableFieldData,
  WorkspacePolicyTableFieldResult,
  WorkspacePolicyTableFieldQuery,
  workspacePolicyTableFieldDataValidator,
} from './policy-table-field.schema'
import {
  workspacePolicyTableFieldQueryValidator,
  workspacePolicyTableFieldResolvers,
} from './policy-table-field.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService, transaction } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { setLocoKitContext } from '@/hooks/locokit'

export const workspacePolicyTableFieldHooks: HookMap<
  Application,
  WorkspacePolicyTableFieldService
> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspacePolicyTableFieldResolvers.dispatch),
      schemaHooks.resolveResult(workspacePolicyTableFieldResolvers.result),
    ],
  },
  before: {
    all: [
      transaction.start(),
      setLocoKitContext,
      checkUserHasAccess({
        allowedProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      }),
    ],
    find: [
      schemaHooks.validateQuery(workspacePolicyTableFieldQueryValidator),
      schemaHooks.resolveQuery(workspacePolicyTableFieldResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspacePolicyTableFieldDataValidator),
      schemaHooks.resolveData(workspacePolicyTableFieldResolvers.data.create),
    ],
  },
  after: {
    find: [schemaHooks.resolveData(workspacePolicyTableFieldResolvers.result), transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}

export interface WorkspacePolicyTableFieldParams
  extends KnexAdapterParams<WorkspacePolicyTableFieldQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspacePolicyTableFieldService extends ObjectionService<
  WorkspacePolicyTableFieldResult,
  WorkspacePolicyTableFieldData,
  WorkspacePolicyTableFieldParams
> {}
