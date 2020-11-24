import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { disallow } from 'feathers-hooks-common'
import { ProcessExecutionStatus } from '../../models/process_execution.model'
import { runTheProcess } from './runTheProcess.hook'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      (context: HookContext) => {
        context.data.status = context.data.status || ProcessExecutionStatus.RUNNING
      }
    ],
    update: [
      disallow()
    ],
    patch: [],
    remove: [
      disallow()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
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
