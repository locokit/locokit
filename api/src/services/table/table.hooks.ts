import * as authentication from '@feathersjs/authentication'
import { disablePagination, iff } from 'feathers-hooks-common'
import { createOrRefreshSQLViewHook, dropSQLViewHook } from '../../hooks/lck-hooks/managementSQLViewHooks'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      disablePagination(),
    ],
    get: [],
    create: [],
    update: [
      iff(
        (context) => context.data.slug,
        dropSQLViewHook,
      ),
    ],
    patch: [
      iff(
        (context) => context.data.slug,
        dropSQLViewHook,
      ),
    ],
    remove: [
      dropSQLViewHook,
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      createOrRefreshSQLViewHook,
    ],
    update: [
      createOrRefreshSQLViewHook,
    ],
    patch: [
      createOrRefreshSQLViewHook,
    ],
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
