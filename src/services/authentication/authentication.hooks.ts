import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { alterItems, lowerCase } from 'feathers-hooks-common'
import { defineAbilities } from '../../abilities/authentication.abilities'
// Don't remove this comment. It's needed to format import lines nicely.

export async function addRulesToUser (context: HookContext): Promise<HookContext> {
  const { user } = context.result
  if (!user) return context
  context.result.user.rules = context.params.rules
  return context
}

export default {
  before: {
    all: [],
    create: [
      lowerCase('email'),
    ],
  },
  after: {
    create: [
      (context: HookContext) => {
        if (!context.result.user.isVerified) {
          throw new Forbidden('User email is not verified. You can\'t login.')
        }
        return context
      },
      alterItems(rec => {
        delete rec.user.verifyToken
        delete rec.user.verifyShortToken
        delete rec.user.verifyExpires
        delete rec.user.verifyChanges
        delete rec.user.resetToken
        delete rec.user.resetShortToken
        delete rec.user.resetExpires
      }),
      defineAbilities,
      addRulesToUser,
    ],
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
