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
      const datasource = await context.app
        .service(SERVICES.CORE_DATASOURCE)
        .get(context.data.datasourceId, {
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
    default:
      throw new NotImplemented(
        `LocoKit context is uncomplete. Method "${
          context.method as string
        }" for table field service need to be implemented.`,
      )
  }
}
