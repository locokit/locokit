import { defineAbility, AbilityBuilder, Ability, ForbiddenError } from '@casl/ability'
import { HookContext } from '@feathersjs/feathers'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { User } from '../../models/user.model'
import { VERB, RESOURCE } from '../../permissions/glossary'

function definedAbilityForUser (allow: Function, user: User) {
  allow(VERB.FIND, RESOURCE.WORKSPACE, {
    $joinRelation: 'groups.[users]',
    'groups.users.id': {
      $in: [user?.id],
    },
  })
}

function definedAbilityForCreator (allow: Function, user: User) {
  allow(VERB.CREATE, RESOURCE.WORKSPACE)
  allow(VERB.UPDATE, RESOURCE.WORKSPACE, { owned: true })
  allow(VERB.REMOVE, RESOURCE.WORKSPACE, { owned: true })
  allow(VERB.CREATE, RESOURCE.GROUP)
}

function definedAbilityForAdmin (allow: Function, user: User) {
  allow(VERB.FIND, RESOURCE.WORKSPACE)
  allow(VERB.CREATE, RESOURCE.WORKSPACE)
  allow(VERB.UPDATE, RESOURCE.WORKSPACE)
  allow(VERB.REMOVE, RESOURCE.WORKSPACE)
  allow(VERB.FIND, RESOURCE.WORKSPACE)
}

/**
 * User abilities
 */
const buildWorkspaceAbilities = (user: User) => defineAbility((allow, forbid) => {
  switch (user.profile) {
    case USER_PROFILE.USER:
      definedAbilityForUser(allow, user)
      break
    case USER_PROFILE.CREATOR:
      definedAbilityForUser(allow, user)
      definedAbilityForCreator(allow, user)
      break
    case USER_PROFILE.ADMIN:
    case USER_PROFILE.SUPERADMIN:
      definedAbilityForUser(allow, user)
      definedAbilityForCreator(allow, user)
      definedAbilityForAdmin(allow, user)
      break
    default:
      forbid(VERB.CREATE, RESOURCE.WORKSPACE)
      break
  }
})

export async function checkPermission (context: HookContext): Promise<HookContext> {
  /**
   * If user is a SUPERADMIN, just continue
   */
  if (context.params.user.profile === USER_PROFILE.SUPERADMIN) return context
  context.params.ability = buildWorkspaceAbilities(context.params.user)

  // switch (context.method) {
  //   case 'create':
  //   case 'find':
  //   case 'get':
  //   case 'patch':
  //   case 'remove':
  //   case 'update':

  // }

  ForbiddenError.from(context.params.ability as Ability)
    .throwUnlessCan(context.method, context.service.options.model.tableName)

  context.params.query = {
    ...context.params.query,
    $joinRelation: 'groupsacl.[users]',
    'groupsacl:users.id': context.params.user?.id,
  }
  console.log(context.params.query)

  return context
}
