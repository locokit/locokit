import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import { toSnakeCase } from '@/utils/toSnakeCase'
import { groupDispatchResolver } from '@/services/core/group/group.resolver'
import { policyDispatchResolver } from '@/services/core/policy/policy.resolver'
import { PolicySchema } from '@/services/core/policy/policy.schema'
import { userDispatchResolver } from '@/services/core/user/user.resolver'

import { WorkspaceQuery, workspaceQuerySchema, WorkspaceSchema } from './core-workspace.schema'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceCreateResolver = resolve<WorkspaceSchema, HookContext>({
  /**
   * Set the creator to the current user logged
   * or return the createdBy
   */
  createdBy: async (createdBy, _data, context) => {
    if ((createdBy === null || createdBy === undefined) && context.params.user) {
      return context.params.user.id
    }
    return createdBy
  },
  /**
   * Compute a slug before insertion too
   */
  slug: async (slug, data) => {
    if (slug === null || slug === undefined) {
      return toSnakeCase(data.name)
    }
  },
})

export const workspaceDefaultResolver = resolve<WorkspaceSchema, HookContext>({})

export const workspaceDispatchResolver = resolve<WorkspaceSchema, HookContext>({
  /**
   * This resolver is used for the relation owner
   * We need to use the dispatch resolver to avoid send sensible data
   *
   * The relation `owner` is fetched when used in a find/get + $joinRelated
   */
  async owner(owner, _data, context) {
    if (owner) return await userDispatchResolver.resolve(owner, context)
  },

  /**
   * The resolver of the group is used, for each item,
   * to remove / complete data sent
   */
  async groups(groups, _data, context) {
    if (groups) {
      return await Promise.all(
        groups.map(async (g) => await groupDispatchResolver.resolve(g, context)),
      )
    }
  },

  /**
   * The resolver of the policy is used, for each item,
   * to remove / complete data sent
   */
  async policies(policys, _data, context) {
    if (policys) {
      let result: PolicySchema[] = []
      const policysPromises: PolicySchema[] = await Promise.all(
        policys.map(async (g) => await policyDispatchResolver.resolve(g, context)),
      )
      result = policysPromises
      return result
    }
  },
})

/**
 * Resolver for patch queries.
 *
 * Actually :
 * * check the softDeletedAt for ADMIN users only
 */
export const workspacePatchResolver = resolve<WorkspaceSchema, HookContext>({
  /**
   * Only admin or internal calls are authorized for this field
   */
  softDeletedAt: async (softDeletedAt, _data, context) => {
    // if there is no user, we are on an internal call
    // we let the patch passed
    // we don't use the context.params.provider for checking, could also work for true external calls
    // (I prefer test the .user data, as it seems more accurate to me)
    if (!context.params.user) return softDeletedAt

    // if external call, we check the user is an ADMIN profile
    // else, throw an error
    if (context.params.user.profile !== USER_PROFILE.ADMIN)
      throw new Forbidden('You cannot patch the `softDeletedAt` property.')

    return softDeletedAt
  },
})

/**
 * Resolver for find queries
 *
 * Actually
 * * set public to true if user is unauthenticated
 * * and filter on softDeletedAt to null by default
 *
 */
export const workspaceQueryResolver = resolve<WorkspaceQuery, HookContext>({
  /**
   * If no user is authenticated, and calls are external
   * return only public workspaces
   */
  async public(value, _data, context) {
    /**
     * if no provider, we are on an internal call
     */
    if (!context.params.provider) return value
    /**
     * if strategy is public, return true
     */
    if (context.params?.public === true) return true
    return value
  },
  /**
   * By default, we don't display workspaces marked "soft-deleted"
   */
  async softDeletedAt(value, _data, context) {
    /**
     * if strategy is public, throw error
     * user can't filter on this field
     */
    if (context.params?.public === true && value) {
      throw new Forbidden('Public API is not allowed to filter on the softDeletedAt field.')
    }
    return value ?? null
  },
})

export const workspaceQueryValidator = getValidator(workspaceQuerySchema, queryValidator)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceResolvers = {
  result: workspaceDefaultResolver,
  dispatch: workspaceDispatchResolver,
  data: {
    create: workspaceCreateResolver,
    update: workspaceDefaultResolver,
    patch: workspacePatchResolver,
  },
  query: workspaceQueryResolver,
}
