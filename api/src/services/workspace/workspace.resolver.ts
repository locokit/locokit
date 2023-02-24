import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import { queryValidator } from '../../commons/validators'
import { toSnakeCase } from '../../utils/toSnakeCase'
import { groupDispatchResolver } from '../auth/group/group.resolver'
import { roleDispatchResolver } from '../auth/role/role.resolver'
import { RoleSchema } from '../auth/role/role.schema'
import { userDispatchResolver } from '../auth/user/user.resolver'

import { WorkspaceQuery, workspaceQuerySchema, WorkspaceSchema } from './workspace.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceCreateResolver = resolve<WorkspaceSchema, HookContext>({
  /**
   * Set the creator to the current user logged
   */
  createdBy: async (createdBy, _data, context) => {
    if ((createdBy === null || createdBy === undefined) && context.params.user) {
      return context.params.user.id
    }
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
   * The resolver of the role is used, for each item,
   * to remove / complete data sent
   */
  async roles(roles, _data, context) {
    let result: RoleSchema[] = []
    if (roles) {
      const rolesPromises: RoleSchema[] = await Promise.all(
        roles.map(async (g) => await roleDispatchResolver.resolve(g, context)),
      )
      result = rolesPromises
    }
    return result
  },
})

// Resolver for query properties
export const workspaceQueryResolver = resolve<WorkspaceQuery, HookContext>({
  /**
   * If no user is authenticated,
   * return only public workspaces
   */
  async public(_value, _data, context) {
    if (!context.params?.user) return true
  },
})

// @ts-expect-error
export const workspaceQueryValidator = getValidator(workspaceQuerySchema, queryValidator)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceResolvers = {
  result: workspaceDefaultResolver,
  dispatch: workspaceDispatchResolver,
  data: {
    create: workspaceCreateResolver,
    update: workspaceDefaultResolver,
    patch: workspaceDefaultResolver,
  },
  query: workspaceQueryResolver,
}
