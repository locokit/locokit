import { resolve } from '@feathersjs/schema'
import type { HookContext, stringNumberUndefined } from '@/declarations'

import type {
  MigrationDataInternal,
  MigrationPatch,
  MigrationResult,
  MigrationQuery,
} from './migration.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const migrationDataResolver = resolve<MigrationDataInternal, HookContext>({
  async createdAt(createdAt) {
    let stringToConvert: stringNumberUndefined = createdAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return createdAt
  },

  async updatedAt(updatedAt) {
    let stringToConvert: stringNumberUndefined = updatedAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return updatedAt
  },
})

// Resolver for making partial updates
export const migrationPatchResolver = resolve<MigrationPatch, HookContext>({
  async updatedAt(updatedAt) {
    let stringToConvert: stringNumberUndefined = updatedAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return updatedAt
  },
})
// Resolver for the data that is being returned
export const migrationResultResolver = resolve<MigrationResult, HookContext>({})

// Resolver for query properties
export const migrationQueryResolver = resolve<MigrationQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const migrationResolvers = {
  result: migrationResultResolver,
  data: {
    create: migrationDataResolver,
    update: migrationDataResolver,
    patch: migrationPatchResolver,
  },
  query: migrationQueryResolver,
}
