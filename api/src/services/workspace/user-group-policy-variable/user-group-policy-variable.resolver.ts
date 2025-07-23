import { resolve, Resolver } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import {
  UserGroupPolicyVariableQuery,
  UserGroupPolicyVariableSchema,
} from './user-group-policy-variable.schema'

export const workspaceUserGroupPolicyVariableDefaultResolver = resolve<
  UserGroupPolicyVariableSchema,
  HookContext
>({})

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceUserGroupPolicyVariableCreateResolver = resolve<
  UserGroupPolicyVariableSchema,
  HookContext
>({})

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceUserGroupPolicyVariablePatchResolver = resolve<
  UserGroupPolicyVariableSchema,
  HookContext
>({
  async updatedAt() {
    return new Date().toISOString()
  },
})

export const workspaceUserGroupPolicyVariableDispatchResolver: Resolver<
  UserGroupPolicyVariableSchema,
  HookContext
> = resolve<UserGroupPolicyVariableSchema, HookContext>({
  /**
   * This resolver is used for the relation workspace
   * We need to use the dispatch resolver to avoid send sensible data
   *
   * The relation `workspace` is fetched when used in a find/get + $joinRelated
   */
})

// Resolver for query properties
export const workspaceUserGroupPolicyVariableQueryResolver = resolve<
  UserGroupPolicyVariableQuery,
  HookContext
>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceUserGroupPolicyVariableResolvers = {
  result: workspaceUserGroupPolicyVariableDefaultResolver,
  dispatch: workspaceUserGroupPolicyVariableDispatchResolver,
  data: {
    create: workspaceUserGroupPolicyVariableCreateResolver,
    update: workspaceUserGroupPolicyVariablePatchResolver,
    patch: workspaceUserGroupPolicyVariablePatchResolver,
  },
  query: workspaceUserGroupPolicyVariableQueryResolver,
}
