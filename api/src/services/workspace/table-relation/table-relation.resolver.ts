import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'

import type {
  TableRelationDataInternal,
  TableRelationPatch,
  TableRelationResult,
  TableRelationQuery,
} from './table-relation.schema'
import { toSnakeCase } from '@/utils/toSnakeCase'

// Resolver for the basic data model (e.g. creating new entries)
export const tableRelationDataResolver = resolve<TableRelationDataInternal, HookContext>(
  {
    /**
     * Compute a slug before insertion too
     */
    async settings(settings, data) {
      console.log('table-relation resolver, update settings', data)
      if (!settings) return { name: data.slug }
      if (!settings.name) settings.name = data.slug
      return settings
    },
  },
  {
    // Convert the raw data into a new structure before running property resolvers
    async converter(rawData) {
      return {
        ...rawData,
        slug: rawData.slug || toSnakeCase(rawData.name),
      }
    },
  },
)

// Resolver for making partial updates
export const tableRelationPatchResolver = resolve<TableRelationPatch, HookContext>({})
// Resolver for the data that is being returned
export const tableRelationResultResolver = resolve<TableRelationResult, HookContext>({})

// Resolver for query properties
export const tableRelationQueryResolver = resolve<TableRelationQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const tableRelationResolvers = {
  result: tableRelationResultResolver,
  data: {
    create: tableRelationDataResolver,
    update: tableRelationDataResolver,
    patch: tableRelationPatchResolver,
  },
  query: tableRelationQueryResolver,
}
