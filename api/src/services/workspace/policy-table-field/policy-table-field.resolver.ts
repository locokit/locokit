import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import {
  workspacePolicyTableFieldQuerySchema,
  WorkspacePolicyTableFieldSchema,
} from './policy-table-field.schema'
import { PolicyQuery } from '@/client'

// Resolver for the basic data model (e.g. creating new entries)
export const workspacePolicyTableFieldCreateResolver = resolve<
  WorkspacePolicyTableFieldSchema,
  HookContext
>({})

export const workspacePolicyTableFieldDefaultResolver = resolve<
  WorkspacePolicyTableFieldSchema,
  HookContext
>({})

export const workspacePolicyTableFieldDispatchResolver = resolve<
  WorkspacePolicyTableFieldSchema,
  HookContext
>({})

// Resolver for query properties
export const workspacePolicyTableFieldQueryResolver = resolve<PolicyQuery, HookContext>({})

export const workspacePolicyTableFieldQueryValidator = getValidator(
  workspacePolicyTableFieldQuerySchema,
  queryValidator,
)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspacePolicyTableFieldResolvers = {
  result: workspacePolicyTableFieldDefaultResolver,
  dispatch: workspacePolicyTableFieldDispatchResolver,
  data: {
    create: workspacePolicyTableFieldCreateResolver,
    update: workspacePolicyTableFieldDefaultResolver,
    patch: workspacePolicyTableFieldDefaultResolver,
  },
  query: workspacePolicyTableFieldQueryResolver,
}
