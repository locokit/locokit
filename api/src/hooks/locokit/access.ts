import { UserGroupResult, WorkspaceResult } from '@/client'
import { HookContext } from '@/declarations'
import { WorkspacePolicyResult } from '@/services/workspace/policy/policy.schema'
import { Forbidden } from '@feathersjs/errors'
import { NextFunction, Paginated } from '@feathersjs/feathers'
import { SERVICES } from '@locokit/definitions'
import { checkUserHasProfile, checkProviderIsInternal } from '../profile.hooks'

/**
 * Check a user has access to a workspace :
 * * he's member of a group of the current workspace
 * * he's the creator of the current workspace
 */
export async function checkUserWorkspaceAccess(context: HookContext, next?: NextFunction) {
  const $workspace: WorkspaceResult & {
    memberships?: UserGroupResult[]
    policies?: WorkspacePolicyResult[]
    creator?: boolean
  } = { ...(context.params.$locokit?.currentWorkspace as WorkspaceResult) }
  /**
   * Do we have the current workspace to check
   */
  if (!$workspace) {
    /**
     * retrieve it
     */
    console.log(context.params)
    throw new Error('Workspace not available')
  }
  const userHasProfile = checkUserHasProfile('ADMIN', context)
  const isInternalProvider = checkProviderIsInternal(context)

  /**
   * Search if the current user is the owner
   */
  if (context.params.user?.id) {
    const userId = context.params.user.id
    if (userId === $workspace.createdBy) {
      $workspace.creator = true
    }
    /**
     * Search if the current user is in a usergroup of the current workspace
     */
    const memberships = (await context.app.service(SERVICES.CORE_USERGROUP).find(
      {
        query: {
          userId: context.params.user?.id,
          'group.workspaceId': $workspace.id,
          $joinEager: 'group',
          $limit: 100,
        },
      },
      {
        params: context.params,
      },
    )) as Paginated<UserGroupResult>
    console.log('checkUserWorkspaceAccess', memberships)
    if (memberships.total === 0) throw new Forbidden('You cannot access this workspace.')
    $workspace.memberships = memberships.data
  } else {
    if (!isInternalProvider && !userHasProfile && !$workspace.creator) {
      throw new Forbidden('You cannot access this workspace.')
    }
  }

  /**
   * Enhance context output with dedicated variables
   */
  context.params.$workspace = $workspace
  if (next) {
    await next()
  } else return context
}
