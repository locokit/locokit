import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import { workspacePolicyQuerySchema, WorkspacePolicySchema } from './policy.schema'
import { PolicyQuery } from '@/client'
import { workspaceGroupDefaultResolver } from '../group/group.resolver'

// Resolver for the basic data model (e.g. creating new entries)
export const workspacePolicyCreateResolver = resolve<WorkspacePolicySchema, HookContext>({
  createdAt: async () => {
    return new Date().toISOString()
  },

  updatedAt: async () => {
    return new Date().toISOString()
  },
  /**
   * Return the workspace id for the current group,
   * useful for checking permissions
   */
  async workspaceId(workspaceId, _data, context) {
    if (workspaceId) return workspaceId
    return context.params.$locokit.currentWorkspace.id
  },
})

export const workspacePolicyDefaultResolver = resolve<WorkspacePolicySchema, HookContext>({
  updatedAt: async () => {
    return new Date().toISOString()
  },
  /**
   * Return the workspace id for the current group,
   * useful for checking permissions
   */
  async workspaceId(workspaceId, _data, context) {
    if (workspaceId) return workspaceId
    return context.params.$locokit.currentWorkspace.id
  },
})

export const workspacePolicyDispatchResolver = resolve<WorkspacePolicySchema, HookContext>({
  /**
   * The resolver of the group is used, for each item,
   * to remove / complete data sent
   */
  async groups(groups, _data, context) {
    if (groups) {
      return await Promise.all(
        groups.map(async (g) => await workspaceGroupDefaultResolver.resolve(g, context)),
      )
    }
  },
})

// Resolver for query properties
export const workspacePolicyQueryResolver = resolve<PolicyQuery, HookContext>({})

export const workspacePolicyQueryValidator = getValidator(
  workspacePolicyQuerySchema,
  queryValidator,
)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspacePolicyResolvers = {
  result: workspacePolicyDefaultResolver,
  dispatch: workspacePolicyDispatchResolver,
  data: {
    create: workspacePolicyCreateResolver,
    update: workspacePolicyDefaultResolver,
    patch: workspacePolicyDefaultResolver,
  },
  query: workspacePolicyQueryResolver,
}
