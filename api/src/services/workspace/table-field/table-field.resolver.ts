import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@locokit/definitions'
import { Value } from '@sinclair/typebox/value'

import {
  TableFieldPatch,
  TableFieldResult,
  TableFieldQuery,
  TableFieldDataInternal,
  tableFieldSettings,
} from './table-field.schema'
import { NotAcceptable, NotFound } from '@feathersjs/errors/lib'
import { Paginated } from '@feathersjs/feathers'
import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'
import { WorkspaceDatasourceResult } from '../datasource/datasource.schema'
import { DB_DIALECT, FIELD_TYPE, SERVICES } from '@locokit/definitions'
import { convertLocoKitFieldTypeToDBType } from './table-field.helpers'

// Resolver for the basic data model (e.g. creating new entries)
export const tableFieldDataResolver = resolve<TableFieldDataInternal, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(slug, data) {
    if (slug) return slug
    return toSnakeCase(data.name)
  },
  /**
   * Compute the db type
   */
  async dbType(dbType, data, context) {
    if (dbType) return dbType
    // we need to know for which engine this field is
    if (!context.params.$locokit?.currentDatasource) throw new NotAcceptable('No datasource found.')

    // then we convert the locokit field type in the db type
    return convertLocoKitFieldTypeToDBType(
      data.type,
      context.params.$locokit?.currentDatasource?.client as DB_DIALECT,
    )
  },
  /**
   * Configure the settings
   */
  async settings(settings, data) {
    // create a default value
    const localSettings = {
      ...Value.Create(tableFieldSettings),
      ...settings,
    }
    switch (data.type) {
      case FIELD_TYPE.ID_NUMBER:
      case FIELD_TYPE.ID_UUID:
        localSettings.primary = !localSettings.foreign
        localSettings.unique = !localSettings.foreign
        localSettings.nullable = !!localSettings.foreign
        break
      case FIELD_TYPE.STRING:
      case FIELD_TYPE.SINGLE_SELECT:
        localSettings.maxLength = localSettings.maxLength ?? 255
    }
    return localSettings
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
    context.params.route.workspaceSchema = `w_${workspace.data[0].slug as string}`

    const datasource: Paginated<WorkspaceDatasourceResult> = await context.app
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
