import { HookContext } from '@feathersjs/feathers'
import Knex from 'knex'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { generateSQLView } from '../../utils/generateKnexRawForTable'

/**
 * Create a schema for a workspace, if needed.
 * Useful for SQL interoperability with other tools needing database access.
 */
export async function createWorkspaceSQLSchema (context: HookContext): Promise<HookContext> {
  /**
   * Check we are in
   * * patch/update/create methods
   * * after hook
   * * for workspace
   */
  if (
    !(
      ['create', 'update', 'patch'].includes(context.method) &&
      context.type === 'after' &&
      context.path === 'workspace'
    )
  ) return context

  const currentWorkspace = context.result as Workspace

  if (currentWorkspace.generate_sql === true) {
    await (context.app.get('knex') as Knex).raw('CREATE SCHEMA IF NOT EXISTS ??;', [currentWorkspace.slug as string])
  }

  /**
   * Generate all views for the current workspace if there are
   */
  const tables = await context.app.services.table.find({
    query: {
      $eager: '[columns.[parents.^]]',
      $joinRelation: 'database',
      'database.workspace_id': currentWorkspace.id,
      $limit: -1,
    },
  }) as Table[]

  await Promise.all(tables.map(currentTable => {
    return generateSQLView(currentTable, currentWorkspace.slug as string, context.app.get('knex'))
  }))

  return context
}

/**
 * Drop a schema for a worskpace.
 * Useful when a user decide to not generate SQL views,
 * we remove the schema and trash all views by the same.
 */
export async function dropWorkspaceSQLSchema (context: HookContext): Promise<HookContext> {
  /**
   * Check we are in
   * * patch/update/remove methods
   * * after hook
   * * for workspace
   */
  if (
    !(
      ['update', 'patch', 'remove'].includes(context.method) &&
      context.type === 'after' &&
      context.path === 'workspace'
    )
  ) return context

  const currentWorkspace = context.result as Workspace

  if (
    currentWorkspace.slug &&
    (
      currentWorkspace.generate_sql !== true ||
      context.method === 'remove'
    )
  ) {
    await (context.app.get('knex') as Knex).raw('DROP SCHEMA IF EXISTS ?? CASCADE;', [currentWorkspace.slug])
  }

  return context
}
