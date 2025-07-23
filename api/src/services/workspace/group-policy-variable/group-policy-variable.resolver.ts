import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import {
  workspaceGroupPolicyVariableQuerySchema,
  WorkspaceGroupPolicyVariableSchema,
} from './group-policy-variable.schema'
import { PolicyQuery } from '@/client'

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceGroupPolicyVariableCreateResolver = resolve<
  WorkspaceGroupPolicyVariableSchema,
  HookContext
>({})

export const workspaceGroupPolicyVariableDefaultResolver = resolve<
  WorkspaceGroupPolicyVariableSchema,
  HookContext
>({})

export const workspaceGroupPolicyVariableDispatchResolver = resolve<
  WorkspaceGroupPolicyVariableSchema,
  HookContext
>({})

// Resolver for query properties
export const workspaceGroupPolicyVariableQueryResolver = resolve<PolicyQuery, HookContext>({})

export const workspaceGroupPolicyVariableQueryValidator = getValidator(
  workspaceGroupPolicyVariableQuerySchema,
  queryValidator,
)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceGroupPolicyVariableResolvers = {
  result: workspaceGroupPolicyVariableDefaultResolver,
  dispatch: workspaceGroupPolicyVariableDispatchResolver,
  data: {
    create: workspaceGroupPolicyVariableCreateResolver,
    update: workspaceGroupPolicyVariableDefaultResolver,
    patch: workspaceGroupPolicyVariableDefaultResolver,
  },
  query: workspaceGroupPolicyVariableQueryResolver,
}
