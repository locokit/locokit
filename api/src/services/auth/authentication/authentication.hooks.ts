import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@/declarations'
import { defineRules } from './authentication.abilities'

// Don't remove this comment. It's needed to format import lines nicely.

export async function addRulesToUser(context: HookContext): Promise<HookContext> {
  // console.log('add rules to user', context.params, context.result.user)
  const { user } = context.result
  if (!user) return context
  context.result.user.rules = context.params.rules
  // console.log('add rules to user', context.params, context.result.user)
  return context
}

export const hooks = {
  after: {
    create: [
      (context: HookContext) => {
        if (!context.result.user.isVerified) {
          throw new Forbidden("User email is not verified. You can't login.")
        }
        if (context.result.user.blocked === true) {
          throw new Forbidden("The account is blocked. You can't login.")
        }
        return context
      },
      // alterItems((rec) => {
      //   console.log('alterItems', rec)
      //   delete rec.user.verifyToken
      //   delete rec.user.verifyShortToken
      //   delete rec.user.verifyExpires
      //   delete rec.user.verifyChanges
      //   delete rec.user.resetToken
      //   delete rec.user.resetShortToken
      //   delete rec.user.resetExpires
      //   delete rec.user.resetAttempts
      //   console.log('alterItems', rec)
      // }),
      defineRules,
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
