import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '../../../declarations'
import { queryValidator } from '../../../commons/validators'
import { workspaceDispatchResolver } from '../../workspace/workspace.resolver'
import { groupDispatchResolver } from '../group/group.resolver'
import { RoleQuery, roleQuerySchema, RoleSchema } from './role.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const roleCreateResolver = resolve<RoleSchema, HookContext>({})

export const roleDefaultResolver = resolve<RoleSchema, HookContext>({})

export const roleDispatchResolver = resolve<RoleSchema, HookContext>({
  /**
   * This resolver is used for the relation workspace
   * We need to use the dispatch resolver to avoid send sensible data
   *
   * The relation `workspace` is fetched when used in a find/get + $joinRelated
   */
  async workspace(workspace, _data, context) {
    if (workspace) return await workspaceDispatchResolver.resolve(workspace, context)
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
})

// Resolver for query properties
export const roleQueryResolver = resolve<RoleQuery, HookContext>({})

// @ts-expect-error
export const roleQueryValidator = getValidator(roleQuerySchema, queryValidator)

// Export all resolvers in a format that can be used with the resolveAll hook
export const roleResolvers = {
  result: roleDefaultResolver,
  dispatch: roleDispatchResolver,
  data: {
    create: roleCreateResolver,
    update: roleDefaultResolver,
    patch: roleDefaultResolver,
  },
  query: roleQueryResolver,
}
