import * as authentication from '@feathersjs/authentication'
import commonHooks from 'feathers-hooks-common'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { HookContext } from '@feathersjs/feathers'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isUserProfile = (profile: USER_PROFILE) => (context: HookContext) => {
  return context.params.user?.profile === profile
}

const isUserWithGreatPower = () => (context: HookContext) => {
  return [USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN].includes(context.params.user?.profile)
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      commonHooks.iff(
        (context: HookContext) => {
          // return !isUserProfile(USER_PROFILE.SUPERADMIN)(context) && commonHooks.isProvider('external')(context)
          return !isUserWithGreatPower()(context) && commonHooks.isProvider('external')(context)
        },
        commonHooks.disallow(),
      ),
    ],
    update: [],
    patch: [
      commonHooks.iff(
        // commonHooks.isNot(isUserProfile(USER_PROFILE.SUPERADMIN)),
        commonHooks.isNot(isUserWithGreatPower()),
        commonHooks.disallow(),
      ),
    ],
    remove: [
      commonHooks.iff(
        (context: HookContext) => {
          // return !isUserProfile(USER_PROFILE.SUPERADMIN)(context) && commonHooks.isProvider('external')(context)
          return !isUserWithGreatPower()(context) && commonHooks.isProvider('external')(context)
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
