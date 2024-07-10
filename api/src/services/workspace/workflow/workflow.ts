import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'
import pkg from 'feathers-swagger'

const { createSwaggerServiceOptions } = pkg
import { WorkflowModel } from './workflow.model'
import { Workflow } from './workflow.class'
import { workflowDataExternalSchema, workflowQuerySchema, workflowSchema } from './workflow.schema'
import { workflowHooks } from './workflow.hooks'

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
export function workflowService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: WorkflowModel,
    name: 'workflow',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_WORKFLOW, new Workflow(options), {
    // A list of all methods this service exposes externally
    methods: ['get', 'find', 'create', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        workflowDataExternalSchema,
        workflowQuerySchema,
        workflowSchema,
      },
      docs: {
        tag: 'workspace > workflow',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_WORKFLOW).hooks(workflowHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_WORKFLOW]: Workflow
  }
}
