/* eslint-disable no-duplicate-case */
import { PROFILE } from '@locokit/definitions'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from '../../abilities/definitions'
import { HookContext } from '@feathersjs/feathers'
import type { UsersResult } from './users.schema'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'

/**
 * Define abilities for group
 * regarding the current hook context.
 *
 * @param user from Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function createAbility(user: UsersResult): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   */
  switch (user?.profile) {
    /**
     * ADMIN can manage all users
     */
    case PROFILE.ADMIN:
      can('manage', 'user')
      break
    /**
     * Others can only see their groups
     */
    default:
      can('read', 'user', ['id', 'name'], { id: { $ne: user.id } })
      can('read', 'user', { id: user.id })
      can('update', 'user', ['name'], { id: user.id })
  }

  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for workspaces
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
async function defineAbilities(context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await createAbility(
    context.params.user as UsersResult,
  )
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}

export function defineAbilitiesIffHook(): IffHook {
  return iff(isProvider('external'), defineAbilities)
}