import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'

import type {
  MigrationDataInternal,
  MigrationPatch,
  MigrationResult,
  MigrationQuery,
} from './migration.schema'
import { SERVICES } from '@locokit/shared'

// Resolver for the basic data model (e.g. creating new entries)
export const migrationDataResolver = resolve<MigrationDataInternal, HookContext>({
  async direction(value) {
    return value || 'both'
  },
  async createdAt() {
    return new Date().toISOString()
  },
  async updatedAt() {
    return new Date().toISOString()
  },
})

// Resolver for making partial updates
export const migrationPatchResolver = resolve<MigrationPatch, HookContext>({
  async updatedAt() {
    return new Date().toISOString()
  },
})
// Resolver for the data that is being returned
export const migrationResultResolver = resolve<MigrationResult, HookContext>({})

// Resolver for query properties
export const migrationQueryResolver = resolve<MigrationQuery, HookContext>({})

export const migrationApplyResolver = resolve<MigrationResult, HookContext>({
  async datasoure(_value, migration, context) {
    return await context.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .get(migration.datasourceId, { query: { $eager: '[tables.[fields]]' } })
  },
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const migrationResolvers = {
  result: migrationResultResolver,
  data: {
    create: migrationDataResolver,
    update: migrationDataResolver,
    patch: migrationPatchResolver,
  },
  query: migrationQueryResolver,
  apply: migrationApplyResolver,
}
