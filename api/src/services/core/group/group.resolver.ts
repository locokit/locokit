import { resolve, Resolver } from '@feathersjs/schema'
import type { HookContext } from '../../../declarations'
import { workspaceDispatchResolver } from '@/services/core/workspace/core-workspace.resolver'
import { userDispatchResolver } from '../../core/user/user.resolver'
import { GroupQuery, GroupSchema } from './group.schema'
import { roleDispatchResolver } from '../role/role.resolver'

// Resolver for the basic data model (e.g. creating new entries)
export const groupCreateResolver = resolve<GroupSchema, HookContext>({})

export const groupDefaultResolver: Resolver<GroupSchema, HookContext> = resolve<
  GroupSchema,
  HookContext
>({
  /**
   * This resolver is used for the relation workspace
   * We need to use the dispatch resolver to avoid send sensible data
   *
   * The relation `workspace` is fetched when used in a find/get + $joinRelated
   */
  async workspace(workspace, _data, context) {
    if (workspace) return await workspaceDispatchResolver.resolve(workspace, context)
  },

  async role(policy, _data, context) {
    if (policy) return await roleDispatchResolver.resolve(policy, context)
  },

  async users(users, _data, context) {
    if (users)
      return await Promise.all(
        users.map(async (u) => await userDispatchResolver.resolve(u, context)),
      )
  },
})

export const groupDispatchResolver = groupDefaultResolver

// Resolver for query properties
export const groupQueryResolver = resolve<GroupQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const groupResolvers = {
  result: groupDefaultResolver,
  dispatch: groupDispatchResolver,
  data: {
    create: groupCreateResolver,
    update: groupDefaultResolver,
    patch: groupDefaultResolver,
  },
  query: groupQueryResolver,
}
