import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'

import type {
  TableRelationData,
  TableRelationPatch,
  TableRelationResult,
  TableRelationQuery,
} from './table-relation.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const tableRelationDataResolver = resolve<TableRelationData, HookContext>({
})

// Resolver for making partial updates
export const tableRelationPatchResolver = resolve<TableRelationPatch, HookContext>({})
// Resolver for the data that is being returned
export const tableRelationResultResolver = resolve<TableRelationResult, HookContext>({})

// Resolver for query properties
export const tableRelationQueryResolver = resolve<TableRelationQuery, HookContext>({
})

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
