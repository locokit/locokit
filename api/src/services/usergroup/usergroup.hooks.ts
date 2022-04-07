import * as authentication from '@feathersjs/authentication'
import commonHooks from 'feathers-hooks-common'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { HookContext } from '@feathersjs/feathers'
import { isUserProfile } from '../../hooks/lck-hooks/isUserProfile'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      commonHooks.iff(
        (context: HookContext) => {
          return !isUserProfile([USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN])(context) && commonHooks.isProvider('external')(context)
        },
        commonHooks.disallow(),
      ),
    ],
    update: [],
    patch: [
      commonHooks.iff(
        // commonHooks.isNot(isUserProfile(USER_PROFILE.SUPERADMIN)),
        commonHooks.isNot(isUserProfile([USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN])),
        commonHooks.disallow(),
      ),
    ],
    remove: [
      commonHooks.iff(
        (context: HookContext) => {
          // return !isUserProfile(USER_PROFILE.SUPERADMIN)(context) && commonHooks.isProvider('external')(context)
          return !isUserProfile([USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN])(context) && commonHooks.isProvider('external')(context)
        },
        commonHooks.disallow(),
      ),
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
