import { USER_PROFILE } from '@locokit/lck-glossary/src'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'

/**
 * Define abilities for entities, high level one.
 * For more grained, we need to go deeper in each service
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function defineAbilities (context: HookContext): Promise<HookContext> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)
  const { user } = context.result

  /**
   * TODO: add public rules for anonymous (e.g., read public workspaces ?)
   */
  switch (user?.profile) {
    case USER_PROFILE.SUPERADMIN:
      can('manage', 'all')
      break
    case USER_PROFILE.ADMIN:
      can('manage', 'group')
      can('manage', 'user')
      can('manage', 'workspace')
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
    case USER_PROFILE.USER:
      can('read', 'workspace')
      can('manage', 'user', { id: user.id })
      break
  }

  const ability = makeAbilityFromRules(rules, { resolveAction })
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}
