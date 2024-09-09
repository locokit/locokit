import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { HookContext } from '@/declarations'
import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'

import { transaction } from '@/feathers-objection'

import { workflowResolvers } from './workflow.resolver'
import {
  workflowDataExternalValidator,
  workflowPatchValidator,
  workflowQueryValidator,
} from './workflow.schema'
import { setLocoKitContext } from '@/hooks/locokit'
import { checkFilepath } from './workflow.helpers'

export const workflowHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(workflowResolvers.query),
      schemaHooks.validateQuery(workflowQueryValidator),
      setLocoKitContext,
    ],
    find: [
      schemaHooks.resolveQuery(workflowResolvers.query),
      schemaHooks.validateQuery(workflowQueryValidator),
      setLocoKitContext,
    ],
    create: [
      setLocoKitContext,
      schemaHooks.validateData(workflowDataExternalValidator),
      schemaHooks.resolveData(workflowResolvers.data.create),
      async (context: HookContext) => {
        return await checkFilepath(
          context.data.filepath,
          context.params.$locokit?.currentWorkspace as WorkspaceResult,
        )
      },
    ],
    patch: [
      setLocoKitContext,
      schemaHooks.validateData(workflowPatchValidator),
      schemaHooks.resolveData(workflowResolvers.data.patch),
      async (context: HookContext) => {
        return await checkFilepath(
          context.data.filepath,
          context.params.$locokit?.currentWorkspace as WorkspaceResult,
        )
      },
    ],
    remove: [setLocoKitContext],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
