import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@/utils/toSnakeCase'

import type {
  TableFieldData,
  TableFieldPatch,
  TableFieldResult,
  TableFieldQuery,
} from './table-field.schema'
import { NotFound } from '@feathersjs/errors/lib'
import { Paginated } from '@feathersjs/feathers'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'
import { DatasourceResult } from '../datasource/datasource.schema'
import { SERVICES } from '@locokit/definitions'

// Resolver for the basic data model (e.g. creating new entries)
export const tableFieldDataResolver = resolve<TableFieldData, HookContext>({
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
  async tableId(value, _data, context) {
    if (value) return value
    const { workspaceSlug, datasourceSlug, tableSlug } = context.params.route
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

    context.params.route.workspaceId = workspace.data[0].id
    context.params.route.workspaceSchema = `w_${workspace.data[0].slug}`

    const datasource: Paginated<DatasourceResult> = await context.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .find({
        query: {
          workspaceId: workspace.data[0].id,
          slug: datasourceSlug,
          $eager: '[tables]',
        },
        authentication,
        provider,
        transaction,
        authenticated,
        user,
      })

    if (datasource.total !== 1) throw new NotFound('Table not found')

    const table = datasource.data[0].tables?.find((t) => t.slug === tableSlug)

    if (!table) throw new NotFound('Table not found')
    return table.id as string
  },
})

// Resolver for making partial updates
export const tableFieldPatchResolver = resolve<TableFieldPatch, HookContext>({})
// Resolver for the data that is being returned
export const tableFieldResultResolver = resolve<TableFieldResult, HookContext>({})

// Resolver for query properties
export const tableFieldQueryResolver = resolve<TableFieldQuery, HookContext>({
  /**
   * Set the workspace id,
   * if call is from /workspace/:slug/table,
   * search the matching workspace.
   *
   * Check also if the user is authorized to access this workspace
   */
  async tableId(value, _data, context) {
    if (value) return value
    const { workspaceSlug, datasourceSlug, tableSlug } = context.params.route
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

    context.params.route.workspaceId = workspace.data[0].id
    context.params.route.workspaceSchema = `w_${workspace.data[0].slug}`

    const datasource: Paginated<DatasourceResult> = await context.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .find({
        query: {
          workspaceId: workspace.data[0].id,
          slug: datasourceSlug,
          $eager: '[tables]',
        },
        authentication,
        provider,
        transaction,
        authenticated,
        user,
      })

    if (datasource.total !== 1) throw new NotFound('Table not found')

    const table = datasource.data[0].tables?.find((t) => t.slug === tableSlug)

    if (!table) throw new NotFound('Table not found')
    return table.id as string
  },
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const tableFieldResolvers = {
  result: tableFieldResultResolver,
  data: {
    create: tableFieldDataResolver,
    update: tableFieldDataResolver,
    patch: tableFieldPatchResolver,
  },
  query: tableFieldQueryResolver,
}
