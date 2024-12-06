import { USER_PROFILE } from '@locokit/definitions'

import { AppAbility, resolveAction } from '../../../abilities/definitions'
import { HookContext } from '@feathersjs/feathers'
import type { UserResult } from './user.schema'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import makeAbilityFromRules from '../../../abilities/makeAbilityFromRules'
import { AbilityBuilder } from '@casl/ability'

/**
 * Define abilities for user
 * regarding the current hook context.
 *
 * @param user from Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function createAbility(user: UserResult): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   */
  switch (user?.profile) {
    /**
     * ADMIN can manage all user
     */
    case USER_PROFILE.ADMIN:
      can('manage', 'user')
      break
    /**
     * Others can only see themselves
     */
    case USER_PROFILE.CREATOR:
    case USER_PROFILE.MEMBER:
      can('read', 'user', ['id', 'name'], { id: { $ne: user.id } })
      can('read', 'user', { id: user.id })
      can('update', 'user', ['name'], { id: user.id })
  }

  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for user
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
async function defineAbilities(context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await createAbility(context.params.user as UserResult)
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}

export function defineAbilitiesIffHook(): IffHook {
  return iff(isProvider('external'), defineAbilities)
}
