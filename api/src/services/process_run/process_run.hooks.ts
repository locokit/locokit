import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { disallow, discard, fastJoin, iff, isProvider } from 'feathers-hooks-common'
import { ProcessRun, ProcessRunStatus } from '../../models/process_run.model'
import { ProcessTrigger } from '../../models/process.model'
import { runTheProcess } from './runTheProcess.hook'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

const peResolvers = (context: HookContext) => {
  return {
    joins: {
      process: () => async (pe: ProcessRun) => {
        pe.process = await context.app.services.process.get(pe.process_id)
      },
    },
  }
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      (context: HookContext) => {
        context.data.status = context.data.status || ProcessRunStatus.RUNNING
      },
      fastJoin(peResolvers, { process: true }),
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
            return ![
              ProcessTrigger.MANUAL,
              ProcessTrigger.CRON,
            ].includes((context.data as ProcessRun).process?.trigger as ProcessTrigger)
          },
          disallow(),
        ).else(
          discard('process'),
        ),
      ).else(
        discard('process'),
      ),
      (context: HookContext) => {
        context.params = {
          ...context.params,
          waitForOutput: context.data.waitForOutput,
        }
      },
      discard('waitForOutput'),
    ],
    update: [
      disallow(),
    ],
    patch: [

    ],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      fastJoin(peResolvers, { process: true }),
      runTheProcess,
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}