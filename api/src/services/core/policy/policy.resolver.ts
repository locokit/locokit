import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import { workspaceDispatchResolver } from '@/services/core/workspace/workspace.resolver'
import { groupDispatchResolver } from '../group/group.resolver'
import { PolicyQuery, policyQuerySchema, PolicySchema } from './policy.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const policyCreateResolver = resolve<PolicySchema, HookContext>({})

export const policyDefaultResolver = resolve<PolicySchema, HookContext>({})

export const policyDispatchResolver = resolve<PolicySchema, HookContext>({
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
export const policyQueryResolver = resolve<PolicyQuery, HookContext>({})

// @ts-expect-error
export const policyQueryValidator = getValidator(policyQuerySchema, queryValidator)

// Export all resolvers in a format that can be used with the resolveAll hook
export const policyResolvers = {
  result: policyDefaultResolver,
  dispatch: policyDispatchResolver,
  data: {
    create: policyCreateResolver,
    update: policyDefaultResolver,
    patch: policyDefaultResolver,
  },
  query: policyQueryResolver,
}
