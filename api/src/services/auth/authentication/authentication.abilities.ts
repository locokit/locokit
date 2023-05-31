import { AbilityBuilder, AnyMongoAbility } from '@casl/ability'
import { USER_PROFILE } from '@locokit/definitions'
import { AppAbility, resolveAction } from '../../../abilities/definitions'
import makeAbilityFromRules from '../../../abilities/makeAbilityFromRules'
import { UserResult } from '@/services/core/user/user.schema'

export function defineAbilities(user: UserResult): AnyMongoAbility {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

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

  return makeAbilityFromRules(rules, { resolveAction })
}
