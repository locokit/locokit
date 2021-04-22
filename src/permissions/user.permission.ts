import { defineAbility, AbilityBuilder, Ability, ForbiddenError } from '@casl/ability'
import { HookContext } from '@feathersjs/feathers'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { User } from '../models/user.model'
import { VERB, RESOURCE } from './glossary'

/**
 * User abilities
 */
const userAbilities = (user: User) => defineAbility((allow) => {
  allow(VERB.FIND, RESOURCE.GROUP, {
    'users.id': user?.id,
  })
})

/**
 * Creator abilities
 */
const creatorAbilities = defineAbility((allow, forbid) => {
  allow(VERB.CREATE, RESOURCE.WORKSPACE)
  allow(VERB.UPDATE, RESOURCE.WORKSPACE, { owned: true })
  allow(VERB.REMOVE, RESOURCE.WORKSPACE, { owned: true })
  allow(VERB.CREATE, RESOURCE.GROUP)
})

/**
 * Admin abilities
 */
const adminAbilities = defineAbility((allow, forbid) => {
  allow(VERB.CREATE, RESOURCE.WORKSPACE)
  allow(VERB.UPDATE, RESOURCE.WORKSPACE)
  allow(VERB.REMOVE, RESOURCE.WORKSPACE)
  allow(VERB.FIND, RESOURCE.WORKSPACE)
})

/**
 * SuperAdmin abilities
 */
const superAdminAbilities = defineAbility((allow, forbid) => {
  allow('create', 'group')
  forbid('create', 'group')
  forbid('update', 'group')
  forbid('remove', 'group')
})

export async function buildAbility (context: HookContext): Promise<HookContext> {
  context.params.ability = userAbilities(context.params.user)
  return context
}

export async function checkPermission (context: HookContext): Promise<HookContext> {
  console.log(context.method, context.service.options.model)

  ForbiddenError.from(context.params.ability as Ability)
    .setMessage(`You cannot ${context.method} ${context.service.options.model}`)
    .throwUnlessCan(context.method, context.service.options.model.tableName)
  console.log(context.params.query)
  context.params.query = {
    ...context.params.query,
    $joinRelation: 'users',
    'users.id': {
      $in: [context.params.user?.id],
    },
  }
  console.log(context.params.query)

  return context
}
