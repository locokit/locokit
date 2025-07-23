import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import {
  workspacePolicyVariableQuerySchema,
  WorkspacePolicyVariableSchema,
} from './policy-variable.schema'
import { PolicyQuery } from '@/client'

// Resolver for the basic data model (e.g. creating new entries)
export const workspacePolicyVariableCreateResolver = resolve<
  WorkspacePolicyVariableSchema,
  HookContext
>({})

export const workspacePolicyVariableDefaultResolver = resolve<
  WorkspacePolicyVariableSchema,
  HookContext
>({})

export const workspacePolicyVariableDispatchResolver = resolve<
  WorkspacePolicyVariableSchema,
  HookContext
>({})

// Resolver for query properties
export const workspacePolicyVariableQueryResolver = resolve<PolicyQuery, HookContext>({})

export const workspacePolicyVariableQueryValidator = getValidator(
  workspacePolicyVariableQuerySchema,
  queryValidator,
)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspacePolicyVariableResolvers = {
  result: workspacePolicyVariableDefaultResolver,
  dispatch: workspacePolicyVariableDispatchResolver,
  data: {
    create: workspacePolicyVariableCreateResolver,
    update: workspacePolicyVariableDefaultResolver,
    patch: workspacePolicyVariableDefaultResolver,
  },
  query: workspacePolicyVariableQueryResolver,
}
