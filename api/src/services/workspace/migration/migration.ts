import { SERVICES } from '@locokit/definitions'
import type { Application } from '@/declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { MigrationModel } from './migration.model'
import { Migration } from './migration.class'
import { migrationDataSchema, migrationQuerySchema, migrationSchema } from './migration.schema'
import { migrationHooks } from './migration.hooks'

/**
 * The migration is pointing a table `migration`
 * but it needs a schema.
 *
 * The schema is specific to the workspace.
 *
 * We can't know the schema in advance,
 * so it is set dynamically with a dedicated hook.
 */
export function migrationService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: MigrationModel,
    name: 'migration',
  }

  // Register our service on the Feathers application
  app.use(SERVICES.WORKSPACE_MIGRATION, new Migration(options), {
    // A list of all methods this service exposes externally
    methods: ['create', 'patch', 'remove', 'apply', 'revert'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        migrationDataSchema,
        migrationQuerySchema,
        migrationSchema,
      },
      docs: {
        tag: 'workspace > migration',
      },
    }),
  })
  // Initialize hooks
  app.service(SERVICES.WORKSPACE_MIGRATION).hooks(migrationHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_MIGRATION]: Migration
  }
}
