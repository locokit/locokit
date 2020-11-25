import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { disallow, discard, fastJoin, iff, isProvider } from 'feathers-hooks-common'
import { ProcessExecution, ProcessExecutionStatus } from '../../models/process_execution.model'
import { ProcessTriggerEvent } from '../../models/process_trigger.model'
import { runTheProcess } from './runTheProcess.hook'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

const peResolvers = (context: HookContext) => {
  return {
    joins: {
      process_trigger: () => async (pe: ProcessExecution) => {
        pe.process_trigger = await context.app.services['process-trigger'].get(pe.process_trigger_id, { query: { $eager: 'process' } })
      }
    }
  }
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      (context: HookContext) => {
        context.data.status = context.data.status || ProcessExecutionStatus.RUNNING
      },
      fastJoin(peResolvers, { process_trigger: true }),
      /**
       * Forbid access to external + trigger event !== [ MANUAL, CRON ]
       */
      iff(
        isProvider('external'),
        iff(
          /**
           * is the trigger event a MANUAL or CRON one ?
           */
          (context: HookContext) => {
            return [
              ProcessTriggerEvent.MANUAL,
              ProcessTriggerEvent.CRON
            ].indexOf((context.data as ProcessExecution).process_trigger?.event as ProcessTriggerEvent) === -1
          },
          disallow()
        ).else(
          discard('process_trigger')
        )
      ).else(
        discard('process_trigger')
      )
    ],
    update: [
      disallow()
    ],
    patch: [

    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      fastJoin(peResolvers, { process_trigger: true }),
      runTheProcess
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
