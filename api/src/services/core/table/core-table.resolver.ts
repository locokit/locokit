import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../../declarations'
import { toSnakeCase } from '@/utils/toSnakeCase'

import type { CoreTablePatch, CoreTableResult, CoreTableQuery } from './core-table.schema'

// Resolver for making partial updates
export const coreTablePatchResolver = resolve<CoreTablePatch, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(_slug, data): Promise<string> {
    return toSnakeCase(data.name)
  },
})
// Resolver for the data that is being returned
export const coreTableResultResolver = resolve<CoreTableResult, HookContext>({})

// Resolver for query properties
export const coreTableQueryResolver = resolve<CoreTableQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const coreTableResolvers = {
  result: coreTableResultResolver,
  data: {
    patch: coreTablePatchResolver,
  },
  query: coreTableQueryResolver,
}