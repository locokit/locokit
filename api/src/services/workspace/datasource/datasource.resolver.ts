import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@/utils/toSnakeCase'

import type {
  DatasourceData,
  DatasourcePatch,
  DatasourceResult,
  DatasourceQuery,
} from './datasource.schema'
import { NotFound } from '@feathersjs/errors/lib'
import { Paginated } from '@feathersjs/feathers'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'
import { logger } from '@/logger'
import { SERVICES } from '@locokit/definitions'

const datasourceLogger = logger.child({ service: 'datasource-hooks' })

// Resolver for the basic data model (e.g. creating new entries)
export const datasourceDataResolver = resolve<DatasourceData, HookContext>({
  /**
   * Compute a slug before insertion too
   */
  async slug(_slug, data) {
    return toSnakeCase(data.name)
  },
  /**
   * Set the workspace id,
   * if call is from /workspace/:slug/datasource,
   * search the matching workspace.
   *
   * Check also if the user is authorized to access this workspace
   */
  async workspaceId(value, _data, context) {
    if (value) return value
    const { workspaceSlug } = context.params.route
    const { authentication, provider, transaction, authenticated, user } = context.params
    if (!workspaceSlug) throw new NotFound('Workspace not found')
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
    if (workspace.total !== 1) throw new NotFound('Workspace not found')
    return workspace.data[0].id as string
  },
})

// Resolver for making partial updates
export const datasourcePatchResolver = resolve<DatasourcePatch, HookContext>({})
// Resolver for the data that is being returned
export const datasourceResultResolver = resolve<DatasourceResult, HookContext>({})

// Resolver for query properties
export const datasourceQueryResolver = resolve<DatasourceQuery, HookContext>({
  /**
   * Set the workspace id,
   * if call is from /workspace/:slug/datasource,
   * search the matching workspace.
   *
   * Check also if the user is authorized to access this workspace
   */
  async workspaceId(value, _data, context) {
    datasourceLogger.debug(
      '[%s] workspaceId resolver with id %s and slug %s',
      context.method,
      context.id,
      context.params.route.workspaceSlug,
    )
    if (value) return value
    const { transaction } = context.params

    /**
     * For get methods
     */
    if (context.id) {
      const datasource = await context.app.service(SERVICES.CORE_DATASOURCE).get(context.id, {
        transaction,
      })
      if (!datasource) throw new NotFound('Datasource not found')
      return datasource.workspaceId as string
    } else {
      /**
       * For find
       */
      const { workspaceSlug } = context.params.route

      if (!workspaceSlug) throw new NotFound('Workspace not found')
      const workspace: Paginated<WorkspaceResult> = await context.app
        .service(SERVICES.CORE_WORKSPACE)
        .find({
          query: {
            slug: workspaceSlug,
            $limit: 1,
          },
          transaction,
        })
      if (workspace.total !== 1) throw new NotFound('Workspace not found')
      return workspace.data[0].id as string
    }
  },
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const datasourceResolvers = {
  result: datasourceResultResolver,
  data: {
    create: datasourceDataResolver,
    update: datasourceDataResolver,
    patch: datasourcePatchResolver,
  },
  query: datasourceQueryResolver,
}
