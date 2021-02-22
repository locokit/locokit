/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */
import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Load the columns of the row being inserted / updated.
 */
export function loadColumnsDefinition () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch (context.method) {
      case 'find':
      case 'get':
        /**
         * if we are on a table id, we select all columns of the table
         */
        let selectedColumns = []
        if (context.params?.query?.table_id) {
          const tableColumns = await context.app.services.column.find({
            query: {
              table_id: context.params?.query?.table_id
            },
            paginate: false
          })
          selectedColumns = tableColumns
        } else if (context.params?.query?.table_view_id) {
          /**
           * if we are on a table view id, we select all columns of the table view
           */
          const tableViewColumns = await context.app.services.column.find({
            query: {
              table_id: context.params?.query?.table_view_id
            },
            paginate: false
          })
          selectedColumns = tableViewColumns
        }
        context.params._meta = {
          ...context.params._meta,
          columns: selectedColumns
        }
        break
      case 'create':
      case 'update':
      case 'patch':
        const table_id = (
          context.method === 'create'
            // when creating a row, table_id is mandatory
            ? context.data.table_id
            // if updating, we normally have loaded the actual row
            // with the loadCurrentRow hook
            : context.params._meta.item.table_id
        )
        const columns = await context.app.services.column.find({
          query: { table_id, $limit: (table_id ? -1 : 20) }
        })
        context.params._meta = {
          ...context.params._meta,
          columns: table_id ? columns : columns.data
        }
        break
    }
    return context
  }
};
