import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@locokit/definitions'

import type {
  DatasourcePatch,
  DatasourceResult,
  DatasourceQuery,
  DatasourceSchema,
} from './datasource.schema'

// Resolver for making partial updates
export const coreDatasourceCreateResolver = resolve<DatasourceSchema, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(_slug, data): Promise<string> {
    return toSnakeCase(data.name)
  },
})
// Resolver for making partial updates
export const coreDatasourcePatchResolver = resolve<DatasourcePatch, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(_slug, data): Promise<string> {
    return toSnakeCase(data.name)
  },
})
// Resolver for the data that is being returned
export const coreDatasourceResultResolver = resolve<DatasourceResult, HookContext>({})

// Resolver for query properties
export const coreDatasourceQueryResolver = resolve<DatasourceQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const coreDatasourceResolvers = {
  result: coreDatasourceResultResolver,
  data: {
    patch: coreDatasourcePatchResolver,
  },
  query: coreDatasourceQueryResolver,
}
