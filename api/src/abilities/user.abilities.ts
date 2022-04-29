/* eslint-disable no-duplicate-case */
import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'

/**
 * Define abilities for group
 * regarding the current hook context.
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function createAbility (
  user: User,
  services: ServiceTypes,
  withJoin: boolean = false,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   */
  switch (user?.profile) {
    /**
     * SUPERADMIN / ADMIN
     * can manage all groups
     */
    case USER_PROFILE.SUPERADMIN:
    case USER_PROFILE.ADMIN:
      can('manage', 'user')
      break
    /**
     * Others can only see their groups
     */
    default:
      can('read', 'user')
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
async function defineAbilities (context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await createAbility(
    context.params.user as User,
    context.app.services,
    context.params.query?.$eager || context.params.query?.$joinRelation,
  )
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}

export function defineAbilitiesIffHook (): IffHook {
  return iff(
    isProvider('external'),
    defineAbilities,
  )
}
