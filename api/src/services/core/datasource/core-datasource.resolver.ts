import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@/utils/toSnakeCase'

import type {
  CoreDatasourcePatch,
  CoreDatasourceResult,
  CoreDatasourceQuery,
  CoreDatasourceSchema,
} from './core-datasource.schema'

// Resolver for making partial updates
export const coreDatasourceCreateResolver = resolve<CoreDatasourceSchema, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(_slug, data): Promise<string> {
    return toSnakeCase(data.name)
  },
})
// Resolver for making partial updates
export const coreDatasourcePatchResolver = resolve<CoreDatasourcePatch, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(_slug, data): Promise<string> {
    return toSnakeCase(data.name)
  },
})
// Resolver for the data that is being returned
export const coreDatasourceResultResolver = resolve<CoreDatasourceResult, HookContext>({})

// Resolver for query properties
export const coreDatasourceQueryResolver = resolve<CoreDatasourceQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const coreDatasourceResolvers = {
  result: coreDatasourceResultResolver,
  data: {
    patch: coreDatasourcePatchResolver,
  },
  query: coreDatasourceQueryResolver,
}
