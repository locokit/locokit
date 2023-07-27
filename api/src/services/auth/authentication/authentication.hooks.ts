import { Forbidden } from '@feathersjs/errors'
// import { alterItems } from 'feathers-hooks-common'
import { USER_PROFILE } from '@locokit/definitions'
import { AbilityBuilder } from '@casl/ability'

import { AppAbility, resolveAction } from '@/abilities/definitions'
import { HookContext } from '@/declarations'
import makeAbilityFromRules from '@/abilities/makeAbilityFromRules'

// Don't remove this comment. It's needed to format import lines nicely.

export async function addRulesToUser(context: HookContext): Promise<HookContext> {
  // console.log('add rules to user', context.params, context.result.user)
  const { user } = context.result
  if (!user) return context
  context.result.user.rules = context.params.rules
  // console.log('add rules to user', context.params, context.result.user)
  return context
}

/**
 * Define abilities for entities, high level one.
 * For more grained, we need to go deeper in each service
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
async function defineAbilities(context: HookContext): Promise<HookContext> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)
  const { user } = context.result

  /**
   * TODO: add public rules for anonymous (e.g., read public workspaces ?)
   */
  switch (user?.profile) {
    case USER_PROFILE.ADMIN:
      can('manage', 'all')
      break
    case USER_PROFILE.CREATOR:
      can('create', 'workspace')
      can('read', 'workspace')
      can('manage', 'user', { id: user.id })
      break
    /**
     * User connected can
     * * find their groups
     * * find workspace of their groups
     */
    case USER_PROFILE.MEMBER:
      can('read', 'workspace')
      can('manage', 'user', { id: user.id })
      break
    /**
     * No profile,
     * anonymous can read public workspace
     */
    default:
      can('read', 'workspace', { public: true })
      break
  }

  const ability = makeAbilityFromRules(rules, { resolveAction })
  // console.log(ability, ability.rules, rules)
  context.params.ability = ability
  context.params.rules = ability.rules

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
