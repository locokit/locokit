import { HookContext } from '@/declarations'
import { TableResult } from '@/services/workspace/table/table.schema'
import { NotAcceptable, NotFound, NotImplemented } from '@feathersjs/errors'
import { SERVICES } from '@locokit/definitions'

import workspaceMigrationHelper from './workspaceMigration.helper'
import workspaceDatasourceHelper from './workspaceDatasource.helper'
import { logger } from '@/logger'
import { Migration as ServiceMigration } from '@/services/workspace/migration/migration.class'

const locokitContextLogger = logger.child({ service: 'hook-locokit-context' })

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
  locokitContextLogger.info('starting on service "%s" ...', context.service.constructor.name)
  const { transaction } = context.params

  context.params.$locokit = {}

  const { workspaceSlug, datasourceSlug, tableSlug, datasetSlug, workflowSlug } =
    context.params?.route ?? {}

  locokitContextLogger.info(
    'slugs : workspace "%s", datasource "%s", workflow "%s", table "%s", dataset "%s"',
    workspaceSlug,
    datasourceSlug,
    workflowSlug,
    tableSlug,
    datasetSlug,
  )

  if (workspaceSlug) {
    locokitContextLogger.debug('workspace slug found: %s', workspaceSlug)
    const workspace = await context.app.service(SERVICES.CORE_WORKSPACE).find({
      transaction,
      query: {
        slug: workspaceSlug,
      },
    })
    if (workspace.total !== 1) throw new NotFound('Workspace not found.')

    context.params.$locokit.currentWorkspaceSlug = workspaceSlug
    context.params.$locokit.currentWorkspace = workspace.data[0]
    context.service.schema = `w_${workspace.data[0].slug as string}`

    if (datasourceSlug && workspace.data[0]) {
      const datasource = await context.app.service(SERVICES.WORKSPACE_DATASOURCE).find({
        transaction,
        query: {
          slug: datasourceSlug,
          // FIXME: To keep as long as we have `context.app.service(SERVICES.WORKSPACE_DATASOURCE).find()` not working correctly
          workspaceId: workspace.data[0].id,
        },
      })
      if (datasource.total !== 1) throw new NotFound('Datasource not found.')
      if (context.service instanceof ServiceMigration) {
        if (['create', 'diff'].includes(context.method))
          context.data.datasourceId = datasource.data[0].id
      }

      context.params.$locokit.currentDatasourceSlug = datasourceSlug
      context.params.$locokit.currentDatasource = datasource.data[0]
    }

    if (workflowSlug && workspace.data[0]) {
      const workflow = await context.app.service(SERVICES.WORKSPACE_WORKFLOW).find({
        transaction,
        query: {
          slug: workflowSlug,
        },
        route: {
          workspaceSlug,
        },
      })
      if (workflow.total !== 1) throw new NotFound('Workflow not found.')
      const currentWorkflow = workflow.data[0]
      if (context.method == 'find') {
        context.params.query.workflowId = context.params.query.workflowId || currentWorkflow.id
      } else {
        context.data.workflowId = context.data.workflowId || currentWorkflow.id

        context.params.$locokit.currentWorkflow = currentWorkflow
      }
    }
  } else {
    locokitContextLogger.info('what is the service of "%s" ?', context.path)

    /**
     * For service TABLE_FIELD,
     * we try to search the workspace,
     * according some data depending on the HTTP method used
     */
    switch ('/' + context.path) {
      case SERVICES.WORKSPACE_DATASOURCE:
        locokitContextLogger.info('workspace datasource service found (method %s)', context.method)
        await workspaceDatasourceHelper(context)
        break
      case SERVICES.WORKSPACE_MIGRATION:
        locokitContextLogger.info('workspace migration service found (method %s)', context.method)
        await workspaceMigrationHelper(context)
        break
      case SERVICES.WORKSPACE_TABLE:
        locokitContextLogger.info('workspace table service found (method %s)', context.method)
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
        context.params.$locokit.currentWorkspaceSlug = workspace?.slug
        context.params.$locokit.currentWorkspace = workspace
        context.service.schema = `w_${workspace?.slug as string}`
        context.params.$locokit.currentDatasourceSlug = datasource.slug
        context.params.$locokit.currentDatasource = datasource

        break
      case SERVICES.WORKSPACE_TABLE_FIELD:
        locokitContextLogger.debug(
          'workspace table field service found (method %s)',
          context.method,
        )
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
            context.params.$locokit.currentWorkspaceSlug = workspace.slug
            context.params.$locokit.currentWorkspace = workspace
            context.service.schema = `w_${workspace.slug as string}`
            context.params.$locokit.currentDatasourceSlug = datasource.slug
            context.params.$locokit.currentDatasource = datasource
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
        locokitContextLogger.debug(
          'workspace table relation service found (method %s)',
          context.method,
        )
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
        context.params.$locokit.currentWorkspaceSlug = relationWorkspace?.slug
        context.params.$locokit.currentWorkspace = relationWorkspace
        context.service.schema = `w_${relationWorkspace?.slug as string}`
        context.params.$locokit.currentDatasourceSlug = tableDatasource.slug
        context.params.$locokit.currentDatasource = tableDatasource

        break
      default:
        throw new NotImplemented('LocoKit context is uncomplete. Need to implement this.')
    }
  }
  locokitContextLogger.info('ending... schema found: %s', context.service.schema)

  return context
}
