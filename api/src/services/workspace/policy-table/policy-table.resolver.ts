import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '@/declarations'
import { queryValidator } from '@/commons/validators'
import { workspacePolicyTableQuerySchema, WorkspacePolicyTableSchema } from './policy-table.schema'
import { PolicyQuery } from '@/client'

// Resolver for the basic data model (e.g. creating new entries)
export const workspacePolicyTableCreateResolver = resolve<WorkspacePolicyTableSchema, HookContext>(
  {},
)

export const workspacePolicyTableDefaultResolver = resolve<WorkspacePolicyTableSchema, HookContext>(
  {},
)

export const workspacePolicyTableDispatchResolver = resolve<
  WorkspacePolicyTableSchema,
  HookContext
>({})

// Resolver for query properties
export const workspacePolicyTableQueryResolver = resolve<PolicyQuery, HookContext>({})

export const workspacePolicyTableQueryValidator = getValidator(
  workspacePolicyTableQuerySchema,
  queryValidator,
)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspacePolicyTableResolvers = {
  result: workspacePolicyTableDefaultResolver,
  dispatch: workspacePolicyTableDispatchResolver,
  data: {
    create: workspacePolicyTableCreateResolver,
    update: workspacePolicyTableDefaultResolver,
    patch: workspacePolicyTableDefaultResolver,
  },
  query: workspacePolicyTableQueryResolver,
}
