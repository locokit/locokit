import { HookContext } from '@feathersjs/feathers'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { generateSQLView, dropSQLView } from '../../utils/generateKnexRawForTable'

export async function createOrRefreshSQLViewHook (context: HookContext): Promise<HookContext> {
  /**
   * Check if we are on :
   * * a table / table_column service
   * * after
   * * create / update / patch
   */
  if (
    !(
      context.type === 'after' &&
      (
        (context.path === 'column' && ['create', 'update', 'patch', 'remove'].includes(context.method)) ||
        (context.path === 'table' && ['update', 'patch'].includes(context.method))
      )
    )
  ) return context

  /* retrieve all columns of the table */
  const tableId: string = (context.path === 'table') ? context.result.id : context.result.table_id

  /**
   * Retrieve the table, its columns and its workspace
   */
  const table: Table = await context.app?.services.table._get(tableId, {
    query: {
      $eager: '[columns.[parents.^],database.[workspace]]',
    },
  })

  /**
   * If the workspace is related to a SQL schema,
   * build or refresh the view
   */
  const workspace = table.database?.workspace as Workspace
  if (workspace.generate_sql !== true) return context

  /**
   * If we are on the column service,
   * we drop the view before refreshing it.
   *
   * We need to do this BEFORE checking columns number,
   * as if the user remove the latest column of the table,
   * we need to drop the view.
   */
  if (context.path === 'column') {
    await dropSQLView(
      table,
      workspace.slug as string,
      context.app.get('knex'),
    )
  }

  /**
   * We can't build view if there is no columns => go away
   */
  if (!table.columns || table.columns.length === 0) return context

  /* generate the SQL */
  await generateSQLView(
    table,
    workspace.slug as string,
    context.app.get('knex'),
  )

  return context
}

/**
 * Drop a SQL View when a table is removed
 */
export async function dropSQLViewHook (context: HookContext): Promise<HookContext> {
  /**
   * Check if we are on :
   * * a table / table_column service
   * * after
   * * create / update / patch
   */
  if (
    !(
      ['remove', 'patch', 'update'].includes(context.method) &&
      context.type === 'before' &&
      context.path === 'table'
    )
  ) return context

  /**
   * Retrieve the table, its columns and its workspace
   */
  const table: Table = await context.app?.services.table._get(context.id, {
    query: {
      $eager: 'database.[workspace]',
    },
  })

  if (table.database?.workspace?.generate_sql !== true) return context

  /* drop the SQL view */
  await dropSQLView(
    table,
    table.database?.workspace?.slug as string,
    context.app.get('knex'),
  )

  return context
}
