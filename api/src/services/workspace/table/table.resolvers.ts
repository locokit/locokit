import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@/utils/toSnakeCase'

import type { TableDataInternal, TablePatch, TableResult, TableQuery } from './table.schema'
import { NotFound } from '@feathersjs/errors/lib'
import { Paginated } from '@feathersjs/feathers'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'
import { DatasourceResult } from '../datasource/datasource.schema'
import { SERVICES } from '@locokit/definitions'

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
   * Set the workspace id,
   * if call is from /workspace/:slug/table,
   * search the matching workspace.
   *
   * Check also if the user is authorized to access this workspace
   */
  async datasourceId(value, _data, context) {
    if (value) return value
    const { workspaceSlug, datasourceSlug } = context.params.route
    const { authentication, provider, transaction, authenticated, user } = context.params
    if (!workspaceSlug || !datasourceSlug) throw new NotFound('Table not found')
    const workspace: Paginated<WorkspaceResult> = await context.app
      .service(SERVICES.CORE_WORKSPACE)
      .find({
        query: {
          slug: workspaceSlug,
          $limit: 1,
        },
        authentication,
        provider,
        transaction,
        authenticated,
        user,
      })
    if (workspace.total !== 1) throw new NotFound('Table not found')

    const datasource: Paginated<DatasourceResult> = await context.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .find({
        query: {
          workspaceId: workspace.data[0].id,
          slug: datasourceSlug,
        },
        authentication,
        provider,
        transaction,
        authenticated,
        user,
      })

    if (datasource.total !== 1) throw new NotFound('Table not found')
    return datasource.data[0].id as string
  },
})

// Resolver for making partial updates
export const tablePatchResolver = resolve<TablePatch, HookContext>({})
// Resolver for the data that is being returned
export const tableResultResolver = resolve<TableResult, HookContext>({})

// Resolver for query properties
export const tableQueryResolver = resolve<TableQuery, HookContext>({
  /**
   * Set the workspace id,
   * if call is from /workspace/:slug/table,
   * search the matching workspace.
   *
   * Check also if the user is authorized to access this workspace
   */
  async datasourceId(value, _data, context) {
    if (value) return value
    const { workspaceSlug, datasourceSlug } = context.params.route
    const { authentication, provider, transaction, authenticated, user } = context.params
    if (!workspaceSlug || !datasourceSlug) throw new NotFound('Table not found')

    const datasource: Paginated<DatasourceResult> = await context.app
      .service(SERVICES.CORE_DATASOURCE)
      .find({
        query: {
          slug: datasourceSlug,
          $joinEager: 'workspace',
          'workspace.slug': workspaceSlug,
        },
        authentication,
        provider,
        transaction,
        authenticated,
        user,
      })

    if (datasource.total !== 1) throw new NotFound('Table not found')
    return datasource.data[0].id as string
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
