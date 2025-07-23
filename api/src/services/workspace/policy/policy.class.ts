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
import { HookMap } from '@feathersjs/feathers'
import { setLocoKitContext } from '@/hooks/locokit'
import { setAbilities } from './policy.ability'
import { authorize } from 'feathers-casl'
const authorizeHook = authorize({ adapter: '@feathersjs/knex', modelName: 'workspace/policy' })

export const workspacePolicyHooks: HookMap<Application, WorkspacePolicyService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspacePolicyResolvers.dispatch),
      schemaHooks.resolveResult(workspacePolicyResolvers.result),
    ],
  },
  before: {
    all: [transaction.start(), setLocoKitContext, setAbilities],
    find: [
      schemaHooks.validateQuery(workspacePolicyQueryValidator),
      schemaHooks.resolveQuery(workspacePolicyResolvers.query),
      authorizeHook,
    ],
    create: [
      schemaHooks.validateData(workspacePolicyDataValidator),
      schemaHooks.resolveData(workspacePolicyResolvers.data.create),
      schemaHooks.validateData(workspacePolicyDataInternalValidator),
      authorizeHook,
    ],
    patch: [
      schemaHooks.resolveData(workspacePolicyResolvers.data.patch),
      schemaHooks.validateData(workspacePolicyPatchValidator),
      authorizeHook,
    ],
  },
  after: {
    all: [transaction.end()],
    find: [schemaHooks.resolveData(workspacePolicyResolvers.result)],
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
