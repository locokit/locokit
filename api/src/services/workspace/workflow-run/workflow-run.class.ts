import type { KnexAdapterParams } from '@feathersjs/knex'
import {
  type WorkflowRunSchema,
  type WorkflowRunQuery,
  type WorkflowRunData,
} from './workflow-run.schema'
import { ObjectionService } from '@/feathers-objection'

import { logger } from '@/logger'
import { Application } from '@/declarations'
import { realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { SERVICES } from '@locokit/definitions'
import { WorkspaceDatasourceResult } from '../datasource/datasource.schema'
import { Paginated } from '@feathersjs/feathers'
import { ConnexionSQL, createAdapter, GenericAdapter } from '@locokit/engine'

const workflowRunLogger = logger.child({ service: 'workflow-run' })

export interface WorkflowRunParams extends KnexAdapterParams<WorkflowRunQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkflowRun extends ObjectionService<
  WorkflowRunSchema,
  WorkflowRunData,
  WorkflowRunParams
> {
  app!: Application

  setup(app: Application) {
    this.app = app
  }

  /**
   * Trigger the run of the matching workflow
   */
  async create(data: WorkflowRunData, params: WorkflowRunParams) {
    workflowRunLogger.info('Running the workflow...')

    const { transaction, $locokit } = params

    if (!$locokit?.currentWorkflow || !$locokit?.currentWorkspace)
      throw new Error('Workflow or workspace is unavailable.')

    /**
     * Build adapters for all workspace datasources
     */
    const datasources = (await this.app.service(SERVICES.WORKSPACE_DATASOURCE).find({
      transaction,
      query: {
        // FIXME: To keep as long as we have `context.app.service(SERVICES.WORKSPACE_DATASOURCE).find()` not working correctly
        workspaceId: $locokit?.currentWorkspace?.id,
      },
    })) as Paginated<WorkspaceDatasourceResult>

    const adapters: Record<string, GenericAdapter> = {}
    await Promise.all(
      datasources.data.map(async (datasource) => {
        /**
         * Create the adapter
         */
        const dsParams: ConnexionSQL = {
          // TODO: change ConnexionSQL's engine typing from 'type' to 'client' property ?
          // be careful for ConnexionBaserow as it's 'type' is 'baserow'
          type: datasource.client,
          options: datasource.connection,
        }

        switch (datasource.type) {
          case 'local':
            const schema = `ds_${datasource.id as string}`
            // const role = `${schema as string}_ro`
            dsParams.options = process.env.LCK_DATABASE_URL as string
            // TODO: enable the read only role : https://github.com/locokit/locokit/issues/243
            // actually there is an error when the ro role access to the schema inspector
            // a function pg_get_serial_sequence try to access some schemas (tiger) the role can't
            // see knex-schema-inspector/lib/dialect/postgres.ts L302
            // dsParams.role = role
            dsParams.schema = schema
            break
          default:
            throw new Error(
              'Other than "local" type is not yet implemented for your datasource. Please ask us to create it, or create a pull request with the implementation.',
            )
        }
        adapters[datasource.slug] = await createAdapter(dsParams)
      }),
    )

    // compute the workflowPath
    const workflowPath = await realpath(
      join('./workflows/', params?.route?.workspaceSlug, $locokit?.currentWorkflow.filepath),
    )

    workflowRunLogger.info('workflow path %s', workflowPath)

    // retrieve the default function of the workflow file
    const { default: workflowFunction } = await import(/* @vite-ignore */ workflowPath)

    data.output = [
      {
        t: Date.now(),
        m: 'No output',
        s: 'INFO',
      },
    ]
    data.result = null as string | null
    data.status = 'NOK'

    try {
      // execute it with adapters + data from request
      const { result, output, status } = await workflowFunction(adapters, data.input)
      data.result = result
      data.status = status
      data.output = output
    } catch (e) {
      data.output.push({ t: Date.now(), m: e as string, s: 'ERROR', a: e })
      data.result = { e }
    }

    // keep the output in a workflow-run
    return super._create(data, params)
  }
}
