import { resolve, Resolver } from '@feathersjs/schema'
import { GROUP_ROLE } from '@locokit/definitions'
import type { HookContext } from '@/declarations'
import { groupDispatchResolver } from '../group/group.resolver'
import { userDispatchResolver } from '../../core/user/user.resolver'
import { UserGroupQuery, UserGroupSchema } from './user-group.schema'

export const workspaceUserGroupDefaultResolver = resolve<UserGroupSchema, HookContext>({})

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceUserGroupCreateResolver = resolve<UserGroupSchema, HookContext>({
  async role(role) {
    return role ?? GROUP_ROLE.MEMBER
  },
})

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceUserGroupPatchResolver = resolve<UserGroupSchema, HookContext>({
  async updatedAt() {
    return new Date().toISOString()
  },
})

export const workspaceUserGroupDispatchResolver: Resolver<UserGroupSchema, HookContext> = resolve<
  UserGroupSchema,
  HookContext
>({
  /**
   * This resolver is used for the relation workspace
   * We need to use the dispatch resolver to avoid send sensible data
   *
   * The relation `workspace` is fetched when used in a find/get + $joinRelated
   */
  async group(group, _data, context) {
    if (group) return await groupDispatchResolver.resolve(group, context)
  },
  async user(user, _data, context) {
    if (user) return await userDispatchResolver.resolve(user, context)
  },
})

// Resolver for query properties
export const workspaceUserGroupQueryResolver = resolve<UserGroupQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceUserGroupResolvers = {
  result: workspaceUserGroupDefaultResolver,
  dispatch: workspaceUserGroupDispatchResolver,
  data: {
    create: workspaceUserGroupCreateResolver,
    update: workspaceUserGroupPatchResolver,
    patch: workspaceUserGroupPatchResolver,
  },
  query: workspaceUserGroupQueryResolver,
}
