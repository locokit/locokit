import { HookContext } from '@/declarations'
import { TableResult } from '@/services/workspace/table/table.schema'
import { NotAcceptable, NotFound, NotImplemented } from '@feathersjs/errors'
import { SERVICES } from '@locokit/definitions'

import workspaceMigrationHelper from './workspaceMigration.helper'
import workspaceDatasourceHelper from './workspaceDatasource.helper'

/**
 * Set LocoKit data useful for services :
 * * current workspace
 * * current datasource
 * * current table
 * * current dataset
 *
 * Those data are populated according route params
 */
export async function setLocoKitContext(context: HookContext) {
  const { transaction } = context.params

  context.$locokit = {}

  const { workspaceSlug, datasourceSlug /* tableSlug, datasetSlug */ } = context.params?.route || {}

  if (workspaceSlug) {
    const workspace = await context.app.service(SERVICES.CORE_WORKSPACE).find({
      transaction,
      query: {
        slug: workspaceSlug,
      },
    })
    if (workspace.total !== 1) throw new NotFound('Workspace not found.')

    context.$locokit.currentWorkspaceSlug = workspaceSlug
    context.$locokit.currentWorkspace = workspace.data[0]
    context.service.schema = `w_${workspace.data[0].slug as string}`

    if (datasourceSlug) {
      const datasource = await context.app.service(SERVICES.WORKSPACE_DATASOURCE).find({
        transaction,
        query: {
          slug: datasourceSlug,
        },
      })
      if (datasource.total !== 1) throw new NotFound('Datasource not found.')

      context.$locokit.currentDatasourceSlug = datasourceSlug
      context.$locokit.currentDatasource = datasource.data[0]
    }
  } else {
    /**
     * For service TABLE_FIELD,
     * we try to search the workspace,
     * according some data depending the HTTP method used
     */
    switch ('/' + context.path) {
      case SERVICES.WORKSPACE_DATASOURCE:
        await workspaceDatasourceHelper(context)
        break
      case SERVICES.WORKSPACE_MIGRATION:
        await workspaceMigrationHelper(context)
        break
      case SERVICES.WORKSPACE_TABLE:
        const datasourceId =
          context.method === 'create'
            ? context.data.datasourceId
            : context.params.query.datasourceId
        const datasource = await context.app.service(SERVICES.CORE_DATASOURCE).get(datasourceId, {
          transaction,
          query: {
            $eager: 'workspace',
          },
        })
        if (!datasource)
          throw new NotAcceptable('Referenced datasource for this migration have not been found.')

        const workspace = datasource.workspace
        context.$locokit.currentWorkspaceSlug = workspace?.slug
        context.$locokit.currentWorkspace = workspace
        context.service.schema = `w_${workspace?.slug as string}`
        context.$locokit.currentDatasourceSlug = datasource.slug
        context.$locokit.currentDatasource = datasource

        break
      case SERVICES.WORKSPACE_TABLE_FIELD:
        switch (context.method) {
          /**
           * We know the tableId,
           * we can find the correlated workspace in core schema
           */
          case 'create':
            const table = await context.app.service(SERVICES.CORE_TABLE).get(context.data.tableId, {
              transaction,
              query: {
                $eager: 'datasource.workspace',
              },
            })
            if (!table)
              throw new NotAcceptable('Referenced table for this field have not been found.')

            const datasource = table.datasource
            const workspace = table.datasource.workspace
            context.$locokit.currentWorkspaceSlug = workspace.slug
            context.$locokit.currentWorkspace = workspace
            context.service.schema = `w_${workspace.slug as string}`
            context.$locokit.currentDatasourceSlug = datasource.slug
            context.$locokit.currentDatasource = datasource
            break
          default:
            throw new NotImplemented(
              `LocoKit context is uncomplete. Method "${
                context.method as string
              }" for table field service need to be implemented.`,
            )
        }
        break
      case SERVICES.WORKSPACE_TABLE_RELATION:
        const tableId = context.data.fromTableId
        const table = (await context.app.service(SERVICES.CORE_TABLE).get(tableId, {
          transaction,
          query: {
            $eager: 'datasource.workspace',
          },
        })) as TableResult

        const tableDatasource = table.datasource

        if (!tableDatasource)
          throw new NotAcceptable('Referenced datasource for this migration have not been found.')

        const relationWorkspace = tableDatasource.workspace
        context.$locokit.currentWorkspaceSlug = relationWorkspace?.slug
        context.$locokit.currentWorkspace = relationWorkspace
        context.service.schema = `w_${relationWorkspace?.slug as string}`
        context.$locokit.currentDatasourceSlug = tableDatasource.slug
        context.$locokit.currentDatasource = tableDatasource

        break
      default:
        throw new NotImplemented('LocoKit context is uncomplete. Need to implement this.')
    }
  }

  return context
}
