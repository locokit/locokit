import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'
import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg

import {
  workflowRunDataExternalSchema,
  workflowRunQuerySchema,
  workflowRunSchema,
} from './workflow-run.schema'
import { WorkflowRunModel } from './workflow-run.model'

import { WorkflowRun } from './workflow-run.class'
import { workflowRunHooks } from './workflow-run.hooks'

/**
 * The workflow service
 * allows to execute workflows on the server.
 *
 * A workflow is basically a nodejs script,
 * exporting a default async function,
 * taking in first parameter a set of adapter,
 * matching each datasource in the workspace.
 *
 * A workflow can be ran,
 * actually, it will run a dedicated script stored on the server.
 */
export function workflowRunService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: WorkflowRunModel,
    name: 'workflowRun',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_WORKFLOW_RUN, new WorkflowRun(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'create'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workflowRunDataExternalSchema,
        workflowRunQuerySchema,
        workflowRunSchema,
      },
      docs: {
        tag: 'workspace > workflow-run',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_WORKFLOW_RUN).hooks(workflowRunHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_WORKFLOW_RUN]: WorkflowRun
  }
}
