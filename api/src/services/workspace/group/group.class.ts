import { KnexAdapterParams } from '@feathersjs/knex'
import { HookMap } from '@feathersjs/feathers'
import { ObjectionService, transaction } from '@/feathers-objection'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { Application } from '@/declarations'

import {
  WorkspaceGroupData,
  WorkspaceGroupResult,
  WorkspaceGroupQuery,
  workspaceGroupDataValidator,
  workspaceGroupQueryValidator,
  workspaceGroupPatchValidator,
} from './group.schema'
import { workspaceGroupResolvers } from './group.resolver'
import { authenticate } from '@feathersjs/authentication'

import { setAbilities } from './group.ability'
import { authorize } from 'feathers-casl'
import { setLocoKitContext } from '@/hooks/locokit'
const authorizeHook = authorize({ adapter: '@feathersjs/knex', modelName: 'workspace/group' })

export const workspaceGroupHooks: HookMap<Application, WorkspaceGroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(workspaceGroupResolvers.dispatch),
      schemaHooks.resolveResult(workspaceGroupResolvers.result),
    ],
  },
  before: {
    all: [transaction.start(), setLocoKitContext, setAbilities],
    find: [
      schemaHooks.validateQuery(workspaceGroupQueryValidator),
      schemaHooks.resolveQuery(workspaceGroupResolvers.query),
      (context) => {
        return context
      },
      authorizeHook,
    ],
    create: [
      schemaHooks.validateData(workspaceGroupDataValidator),
      schemaHooks.resolveData(...workspaceGroupResolvers.data.create),
      (context) => {
        return context
      },
      authorizeHook,
    ],
    patch: [
      schemaHooks.validateData(workspaceGroupPatchValidator),
      schemaHooks.resolveData(...workspaceGroupResolvers.data.patch),
      authorizeHook,
    ],
    remove: [schemaHooks.resolveData(...workspaceGroupResolvers.data.remove), authorizeHook],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}

export interface WorkspaceGroupParams extends KnexAdapterParams<WorkspaceGroupQuery> {}

// By default, calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceGroupService extends ObjectionService<
  WorkspaceGroupResult,
  WorkspaceGroupData,
  WorkspaceGroupParams
> {}
