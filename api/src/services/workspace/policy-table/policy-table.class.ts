import { KnexAdapterParams } from '@feathersjs/knex'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  WorkspacePolicyTableData,
  WorkspacePolicyTableResult,
  WorkspacePolicyTableQuery,
  workspacePolicyTableDataValidator,
  workspacePolicyTablePatchValidator,
} from './policy-table.schema'
import {
  workspacePolicyTableQueryValidator,
  workspacePolicyTableResolvers,
} from './policy-table.resolver'
import { Application } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService, transaction } from '@/feathers-objection'
import { USER_PROFILE } from '@locokit/definitions'
import { HookMap } from '@feathersjs/feathers'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { setLocoKitContext } from '@/hooks/locokit'

export const workspacePolicyTableHooks: HookMap<Application, WorkspacePolicyTableService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspacePolicyTableResolvers.dispatch),
      schemaHooks.resolveResult(workspacePolicyTableResolvers.result),
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
      schemaHooks.validateQuery(workspacePolicyTableQueryValidator),
      schemaHooks.resolveQuery(workspacePolicyTableResolvers.query),
    ],
    create: [
      schemaHooks.validateData(workspacePolicyTableDataValidator),
      schemaHooks.resolveData(workspacePolicyTableResolvers.data.create),
    ],
    patch: [
      schemaHooks.validateData(workspacePolicyTablePatchValidator),
      schemaHooks.resolveData(workspacePolicyTableResolvers.data.patch),
    ],
  },
  after: {
    all: [transaction.end()],
    find: [schemaHooks.resolveData(workspacePolicyTableResolvers.result)],
  },
  error: {
    all: [transaction.rollback()],
  },
}

export interface WorkspacePolicyTableParams extends KnexAdapterParams<WorkspacePolicyTableQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspacePolicyTableService extends ObjectionService<
  WorkspacePolicyTableResult,
  WorkspacePolicyTableData,
  WorkspacePolicyTableParams
> {}
