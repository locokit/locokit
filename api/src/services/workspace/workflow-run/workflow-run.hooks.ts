import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'

import { workflowRunResolvers } from './workflow-run.resolver'
import { workflowRunDataExternalValidator, workflowRunQueryValidator } from './workflow-run.schema'
import { setLocoKitContext } from '@/hooks/locokit'
import { iff } from 'feathers-hooks-common'
import { HookContext } from '@/declarations'

export const workflowRunHooks = {
  around: {
    all: [],
  },
  before: {
    all: [transaction.start()],
    find: [
      authenticate('jwt'),
      schemaHooks.resolveQuery(workflowRunResolvers.query),
      schemaHooks.validateQuery(workflowRunQueryValidator),
      setLocoKitContext,
    ],
    create: [
      setLocoKitContext,
      /**
       * authenticate user if the workflow is private (not public)
       */
      iff((context: HookContext) => {
        return !context.params.$locokit?.currentWorkflow?.public
      }, authenticate('jwt')),
      schemaHooks.validateData(workflowRunDataExternalValidator),
      schemaHooks.resolveData(workflowRunResolvers.data.create),
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
