import * as authentication from '@feathersjs/authentication'
import { checkIfTableViewIsLocked } from './checkIfTableViewIsLocked.hook'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      checkIfTableViewIsLocked,
    ],
    update: [
      checkIfTableViewIsLocked,
    ],
    patch: [
      checkIfTableViewIsLocked,
    ],
    remove: [
      checkIfTableViewIsLocked,
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
