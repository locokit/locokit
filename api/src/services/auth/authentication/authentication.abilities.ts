import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { USER_PROFILE } from '@locokit/definitions'
import { resolveAction } from '@/abilities/definitions'
import { UserResult } from '@/services/core/user/user.schema'
import { HookContext } from '@feathersjs/feathers'

export function getAbility(user: UserResult) {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, build } = new AbilityBuilder(createMongoAbility)

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
  }

  return build({ resolveAction })
}

export function setAbilities(context: HookContext) {
  if (!context.params.provider) return context

  const ability = getAbility(context.params.user as UserResult)

  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}
