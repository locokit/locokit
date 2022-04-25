import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { authorize } from 'feathers-casl/dist/hooks'
import { disablePagination, getItems, replaceItems } from 'feathers-hooks-common'
import { defineAbilitiesIffHook } from '../../abilities/group.abilities'
import { User } from '../../models/user.model'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

function removePropertyForUser (user: User): Partial<User> {
  const userPatched: Partial<User> = {
    ...user,
  }
  delete userPatched.password
  delete userPatched.verifyChanges
  delete userPatched.verifyExpires
  delete userPatched.verifyShortToken
  delete userPatched.verifyToken
  delete userPatched.resetExpires
  delete userPatched.resetShortToken
  delete userPatched.resetToken
  return userPatched
}

export default {
  before: {
    all: [
      authenticate('jwt'),
      defineAbilitiesIffHook(),
    ],
    find: [
      disablePagination(),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    get: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    create: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    update: [],
    patch: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    remove: [
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
  },

  after: {
    all: [
      function removeUserData (context: HookContext) {
        const items = getItems(context)
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (item.users) {
              item.users = item.users.map(removePropertyForUser)
            }
          })
        } else {
          if (items.users) {
            items.users = items.users.map(removePropertyForUser)
          }
        }
        replaceItems(context, items)
        return context
      },
    ],
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
