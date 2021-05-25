import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import { disablePagination, getItems, replaceItems } from 'feathers-hooks-common'
import { User } from '../../models/user.model'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

function removePropertyForUser (user: User): void {
  delete user.password
  delete user.verifyChanges
  delete user.verifyExpires
  delete user.verifyShortToken
  delete user.verifyToken
  delete user.resetExpires
  delete user.resetShortToken
  delete user.resetToken
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      disablePagination(),
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      function removeUserData (context: HookContext) {
        const items = getItems(context)
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (item.users) {
              item.users.forEach(removePropertyForUser)
            }
          })
        } else {
          if (items.users) {
            items.users.forEach(removePropertyForUser)
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
