import { KnexAdapterParams } from '@feathersjs/knex'
import {
  WorkspaceData,
  WorkspaceResult,
  WorkspaceQuery,
  WorkspaceDataInternal,
  WorkspacePatch,
} from './core-workspace.schema'
import { ObjectionService } from '@/feathers-objection'
import { Id, NullableId } from '@feathersjs/feathers'
import { UserResult } from '../user/user.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'
import { Transaction } from 'objection'

export interface WorkspaceParams extends KnexAdapterParams<WorkspaceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceService extends ObjectionService<
  WorkspaceResult,
  // Partial<WorkspaceData | WorkspaceDataInternal>,
  WorkspaceData | WorkspaceDataInternal,
  WorkspaceParams,
  Partial<WorkspacePatch>
> {
  /**
   * Remove a workspace, according to authenticated user :
   * * if the user is a member / creator, mark the workspace as "soft-deleted"
   * * if the user is an admin AND the workspace is marked as "soft-deleted", delete it
   */
  async remove(id: Id, params?: WorkspaceParams): Promise<WorkspaceResult>
  async remove(id: null, params?: WorkspaceParams): Promise<WorkspaceResult[]>
  async remove(
    id: NullableId,
    params?: WorkspaceParams,
  ): Promise<WorkspaceResult | WorkspaceResult[]> {
    /**
     * This method works only for an Id
     */
    if (!id) throw new Forbidden('Workspace removal requires an id.')

    /**
     * The user need to be known
     */
    if (!params?.user) throw new Forbidden('Workspace removal needs an authenticated user.')

    const isUserAdmin = (params?.user as UserResult)?.profile === USER_PROFILE.ADMIN
    const currentWorkspace = await this.get(id, {
      transaction: params.transaction,
    })
    const isUserOwner = currentWorkspace.createdBy === params?.user?.id

    if (!isUserAdmin && !isUserOwner)
      throw new Forbidden(
        `You're not authorized to remove the workspace "${
          currentWorkspace.name as string
        }": you're neither an admin or the workspace's owner.`,
        {
          id: currentWorkspace.id,
          name: currentWorkspace.name,
        },
      )

    /**
     * Set softDeletedAt if not already set
     * and return the workspace.
     * ONLY FOR OWNERS
     */
    if (!currentWorkspace.softDeletedAt) {
      if (isUserOwner) {
        return await this._patch(
          id,
          {
            softDeletedAt: new Date(Date.now()).toISOString(),
          },
          {
            transaction: params.transaction,
          },
        )
      } else {
        throw new Forbidden('Only the owner of the workspace can remove it.')
      }
    } else {
      if (isUserAdmin) {
        /**
         * If already set, proceed to the removal
         */
        const result = await this._remove(id, params)

        /**
         * Remove physically the workspace with dropWorkspaceSchema
         */
        const knex = this.Model.knex()
        await knex
          .raw('SELECT core."dropWorkspaceSchema"(?)', currentWorkspace.slug)
          .transacting(params?.transaction?.trx as Transaction)

        return result
      } else if (isUserOwner) {
        throw new Forbidden('Workspace is already soft-deleted.')
      } else {
        throw new Forbidden("You're not authorized to remove this workspace")
      }
    }
  }
}
