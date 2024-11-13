import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@locokit/definitions'

import type { TableDataInternal, TablePatch, TableResult, TableQuery } from './table.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const tableDataResolver = resolve<TableDataInternal, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(slug, data) {
    if (slug) return slug
    return toSnakeCase(data.name)
  },
  /**
   * Set the datasource id,
   * if call is from /workspace/:slug/datasource/:slug/table,
   * search the matching datasource.
   *
   * Check also if the user is authorized to access this workspace (acl)
   */
  async datasourceId(value, _data, context) {
    if (value) return value
    return context.params.$locokit?.currentDatasource?.id
    // Todo WIP ACL
  },
})

// Resolver for making partial updates
export const tablePatchResolver = resolve<TablePatch, HookContext>({})
// Resolver for the data that is being returned
export const tableResultResolver = resolve<TableResult, HookContext>({})

// Resolver for query properties
export const tableQueryResolver = resolve<TableQuery, HookContext>({
  /**
   * Set the datasource id,
   * if call is from /workspace/:slug/datasource/:slug/table,
   * search the matching datasource.
   *
   * Check also if the user is authorized to access this workspace
   */
  async datasourceId(value, _data, context) {
    if (value) return value
    return context.params.$locokit?.currentDatasource?.id
    // Todo WIP ACL
  },
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const tableResolvers = {
  result: tableResultResolver,
  data: {
    create: tableDataResolver,
    update: tableDataResolver,
    patch: tablePatchResolver,
  },
  query: tableQueryResolver,
}
