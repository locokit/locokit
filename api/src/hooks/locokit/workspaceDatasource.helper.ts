import { HookContext } from '@/declarations'
import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'
import { DatasourceResult } from '@/services/core/datasource/datasource.schema'
import { NotAcceptable, NotImplemented } from '@feathersjs/errors'
import { Id } from '@feathersjs/feathers'
import { SERVICES } from '@locokit/definitions'

/**
 * Helper to compute workspace
 * from the endpoint WORKSPACE_DATASOURCE
 */
export default async function (context: HookContext) {
  const { transaction } = context.params
  context.params.$locokit = {}

  switch (context.method) {
    /**
     * We know the tableId,
     * we can find the correlated workspace in core schema
     */
    case 'create':
      const workspaceCreate: WorkspaceResult = await context.app
        .service(SERVICES.CORE_WORKSPACE)
        .get(context.data.workspaceId, { transaction })

      if (!workspaceCreate)
        throw new NotAcceptable('Referenced datasource for this migration have not been found.')

      context.params.$locokit.currentWorkspaceSlug = workspaceCreate?.slug
      context.params.$locokit.currentWorkspace = workspaceCreate
      context.service.schema = `w_${workspaceCreate?.slug as string}`
      break
    case 'get':
      const datasourceGet: DatasourceResult = await context.app
        .service(SERVICES.CORE_DATASOURCE)
        .get(context.id as Id, {
          query: { $eager: 'workspace' },
          transaction,
        })
      context.service.schema = `w_${datasourceGet.workspace?.slug as string}`
      break
    case 'find':
      const workspaceFind: WorkspaceResult = await context.app
        .service(SERVICES.CORE_WORKSPACE)
        .get(context.params.query.workspaceId, { transaction })
      context.service.schema = `w_${workspaceFind.slug as string}`
      break
    case 'remove':
      const datasourceRemove: DatasourceResult = await context.app
        .service(SERVICES.CORE_DATASOURCE)
        .get(context.id as Id, { query: { $eager: 'workspace' }, transaction })
      context.service.schema = `w_${datasourceRemove.workspace?.slug as string}`
      break
    default:
      throw new NotImplemented(
        `LocoKit context is uncomplete. Method "${
          context.method as string
        }" for table field service need to be implemented.`,
      )
  }
}
