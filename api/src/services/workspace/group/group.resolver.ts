import { resolve, Resolver } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { userRestrictedDispatchResolver } from '@/services/core/user/user.resolver'
import { WorkspaceGroupQuery, WorkspaceGroupSchema } from './group.schema'
import { workspacePolicyDispatchResolver } from '../policy/policy.resolver'

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceGroupCreateResolver = resolve<WorkspaceGroupSchema, HookContext>({})

export const workspaceGroupDefaultResolver: Resolver<WorkspaceGroupSchema, HookContext> = resolve<
  WorkspaceGroupSchema,
  HookContext
>({
  async policy(policy, _data, context) {
    if (policy) return await workspacePolicyDispatchResolver.resolve(policy, context)
  },

  async users(users, _data, context) {
    if (users)
      return await Promise.all(
        users.map(async (u) => await userRestrictedDispatchResolver.resolve(u, context)),
      )
  },
})

export const workspaceGroupPatchResolver: Resolver<WorkspaceGroupSchema, HookContext> = resolve<
  WorkspaceGroupSchema,
  HookContext
>({
  async updatedAt() {
    return new Date().toISOString()
  },
})

export const workspaceGroupDispatchResolver = workspaceGroupDefaultResolver

// Resolver for query properties
export const workspaceGroupQueryResolver = resolve<WorkspaceGroupQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceGroupResolvers = {
  result: workspaceGroupDefaultResolver,
  dispatch: workspaceGroupDispatchResolver,
  data: {
    create: workspaceGroupCreateResolver,
    patch: [workspaceGroupDefaultResolver, workspaceGroupPatchResolver],
  },
  query: workspaceGroupQueryResolver,
}
