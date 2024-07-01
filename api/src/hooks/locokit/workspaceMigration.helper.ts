import { HookContext } from '@/declarations'
import { NotAcceptable, NotImplemented } from '@feathersjs/errors'
import { SERVICES } from '@locokit/definitions'

/**
 * Helper to compute workspac & datasource
 * from the endpoint WORKSPACE_MIGRATION
 */
export default async function (context: HookContext) {
  const { transaction } = context.params
  context.$locokit = {}

  switch (context.method) {
    /**
     * We know the tableId,
     * we can find the correlated workspace in core schema
     */
    case 'create':
    case 'apply':
      const datasourceCreate = await context.app
        .service(SERVICES.CORE_DATASOURCE)
        .get(context.data.datasourceId, {
          transaction,
          query: {
            $eager: 'workspace',
          },
        })
      if (!datasourceCreate)
        throw new NotAcceptable('Referenced datasource for this migration have not been found.')

      const workspaceCreate = datasourceCreate.workspace
      context.$locokit.currentWorkspaceSlug = workspaceCreate?.slug
      context.$locokit.currentWorkspace = workspaceCreate
      context.service.schema = `w_${workspaceCreate?.slug as string}`
      context.$locokit.currentDatasourceSlug = datasourceCreate.slug
      context.$locokit.currentDatasource = datasourceCreate
      break
    case 'find':
      const queryDatasourceId = context.params.query.datasourceId
      if (!queryDatasourceId) throw new NotAcceptable('query param `datasourceId` is mandatory.')
      const datasourceFind = await context.app
        .service(SERVICES.CORE_DATASOURCE)
        .get(queryDatasourceId, {
          transaction,
          query: {
            $eager: 'workspace',
          },
        })
      if (!datasourceFind)
        throw new NotAcceptable('Referenced datasource for this migration have not been found.')

      const workspaceFind = datasourceFind.workspace
      context.$locokit.currentWorkspaceSlug = workspaceFind?.slug
      context.$locokit.currentWorkspace = workspaceFind
      context.service.schema = `w_${workspaceFind?.slug as string}`
      context.$locokit.currentDatasourceSlug = datasourceFind.slug
      context.$locokit.currentDatasource = datasourceFind
      break
    default:
      throw new NotImplemented(
        `LocoKit context is uncomplete. Method "${
          context.method as string
        }" for workspace migration service need to be implemented.`,
      )
  }
}
