// /* eslint-disable no-duplicate-case */
import { USER_PROFILE } from '@locokit/definitions'
// import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'
import makeAbilityFromRules from '../../../abilities/makeAbilityFromRules'
import { AbilityBuilder } from '@casl/ability'
import { AppAbility, resolveAction } from '../../../abilities/definitions'

// import { AppAbility, resolveAction } from '../../abilities/definitions'
// import { HookContext } from '@feathersjs/feathers'
import type { UserResult } from '../../core/user/user.schema'
import { ServiceTypes } from '@/declarations'
// import { ServiceTypes } from '../declarations'
// import { LckAclSet } from '../models/aclset.model'
// import { iff, IffHook, isProvider } from 'feathers-hooks-common'

/**
 * Create abilities for workspace
 * in a feathers-casl way,
 * regarding several params : user, withJoin
 * and by accessing services when needed.
 *
 * @returns Promise<AppAbility>
 */
export async function createAbility(
  user: UserResult,
  services: ServiceTypes,
  withJoin: boolean = false,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, cannot, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   * TODO: add public rules for workspace (e.g., read public workspaces ?)
   * need to "free" the workspace endpoint (authentication is not mandatory for find / get)
   */
  switch (user?.profile) {
    /**
     * ADMIN
     * can manage all workspaces
     */
    case USER_PROFILE.ADMIN:
      can('manage', 'workspace')
      break
    /**
     * CREATOR can manage their workspace,
     * but only their,
     * so they inherit same permissions than USER
     */
    case USER_PROFILE.CREATOR:
      // find all workspace where user have a group "manager" of the workspace
      // const aclsetsCREATOR = (await services.role.find({
      //   query: {
      //     $joinRelation: 'groupsacl.[users]',
      //     'groupsacl:users.id': user.id,
      //   },
      //   paginate: false,
      // })) as LckAclSet[]
      cannot('manage', 'workspace')
      can('create', 'workspace')
      // const workspaceIdsManagerCREATOR = aclsetsCREATOR
      //   .filter((aclset) => aclset.manager)
      //   .map((aclset) => aclset.workspace_id)
      // const workspaceIdsCREATOR = aclsetsCREATOR.map(
      //   (aclset) => aclset.workspace_id,
      // )
      can('manage', 'workspace', {
        createdBy: user.id,
        // [withJoin ? 'workspace.id' : 'id']: {
        //   $in: workspaceIdsManagerCREATOR,
        // },
      })
      // can('read', 'workspace', {
      //   [withJoin ? 'workspace.id' : 'id']: {
      //     $in: workspaceIdsCREATOR,
      //   },
      // })
      break
    /**
     * User connected can
     * * find workspace of their groups
     * USER cannot create / manage workspace,
     * even if they are member of a group having a manager aclset on a workspace
     */
    case USER_PROFILE.MEMBER:
      //       // find all workspaces where user is linked to the workspace through aclset > group
      //       const aclsetsUSER = (await services.aclset.find({
      //         query: {
      //           $joinRelation: 'groups.[users]',
      //           'groups:users.id': user.id,
      //         },
      //         paginate: false,
      //       })) as LckAclSet[]
      cannot('manage', 'workspace')
    //       const workspaceIdsManagerUSER = aclsetsUSER
    //         .filter((aclset) => aclset.manager)
    //         .map((aclset) => aclset.workspace_id)
    //       const workspaceIdsUSER = aclsetsUSER.map((aclset) => aclset.workspace_id)
    //       const uniqueWorkspacesIds = [...new Set(workspaceIdsUSER)]
    //       if (workspaceIdsUSER.length > 0) {
    //         can('read', 'workspace', {
    //           [withJoin ? 'workspace.id' : 'id']: {
    //             $in: uniqueWorkspacesIds,
    //           },
    //         })
    //       }
    //       if (workspaceIdsManagerUSER.length > 0) {
    //         can(['read', 'update', 'delete'], 'workspace', {
    //           [withJoin ? 'workspace.id' : 'id']: {
    //             $in: workspaceIdsManagerUSER,
    //           },
    //         })
    //       }
  }
  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

// /**
//  * Define abilities for workspaces
//  * and add them to the feathers context.
//  *
//  * @param context Hook context, provided by FeathersJS
//  * @returns Promise<HookContext>
//  */
// export async function defineAbilities(
//   context: HookContext,
// ): Promise<HookContext> {
//   const ability: AppAbility = await createAbility(
//     context.params.user as User,
//     context.app.services,
//     context.params.query?.$eager ||
//       context.params.query?.$joinRelation ||
//       context.params.query?.$modify,
//   )
//   context.params.ability = ability
//   context.params.rules = ability.rules

//   return context
// }

// export function defineAbilitiesIffHook(): IffHook {
//   return iff(isProvider('external'), defineAbilities)
// }
