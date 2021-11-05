/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/naming-convention */

import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Load the columns of the row being inserted / updated.
 */
export function loadColumnsDefinition (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    let selectedColumns = []
    let tableId = null
    let tableViewId = null
    // do we have a table_id or a table_view_id

    switch (context.method) {
      case 'find':
        /**
         * if we are on a table id, we select all columns of the table
         */
        tableId = context.params?.query?.table_id
        tableViewId = context.params?.query?.table_view_id
        break
      case 'get':
        // We just need it in 'after' hooks so we get the table id from the kept row
        tableId = context.result?.table_id
        break
      case 'create':
      case 'update':
      case 'patch':
        // eslint-disable-next-line @typescript-eslint/naming-convention
        tableId = (
          context.method === 'create'
            // when creating a row, table_id is mandatory
            ? context.data.table_id
            // if updating, we normally have loaded the actual row with the loadCurrentRow hook
            : context.params._meta?.item.table_id
        )
        tableViewId = (
          // TODO: need to think about update / patch methdods
          context.method === 'create'
            // when creating a row, table_id is mandatory
            ? context.data.table_view_id
            // if updating, we normally have loaded the actual row with the loadCurrentRow hook
            : context.params._meta?.item.table_view_id
        )
        break
    }

    if (tableId) {
      selectedColumns = await context.app.services.column.find({
        query: {
          table_id: tableId,
        },
        paginate: false,
      })
    } else if (tableViewId) {
      const tableView = await context.app.services.view.get(tableViewId, {
        query: {
          $eager: '[columns]',
        },
        paginate: false,
      })
      // TODO: need to think about update / patch methdods
      if (context.method === 'create') { context.data.table_id = tableView.table_id }
      selectedColumns = tableView.columns
    }
    context.params._meta = {
      ...context.params._meta,
      columns: selectedColumns,
    }
    return context
  }
};

/**
 * Load the updated columns of the row(s) being updated.
 *
 * @param {HookContext} context
 * @returns {HookContext} the context with the list of updated columns (context.params._meta.updatedColumnsWithChildren)
 */
export function loadUpdatedColumnsWithChildren (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Check that the updated columns are formula columns
    const updatedColumnsWithChildren = await context.app.services.column.find({
      query: {
        id: {
          $in: context.params._meta.columnsIdsTransmitted,
        },
        table_id: context.params.query?.table_id,
        $eager: '[children.^]',
      },
      paginate: false,
    }) as TableColumn[]
    context.params._meta.updatedColumnsWithChildren = updatedColumnsWithChildren
    return context
  }
}
