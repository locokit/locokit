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
          const tableView = await context.app.services.view.get(context.params.query.table_view_id, {
            query: {
              $eager: '[columns]'
            },
            paginate: false
          })
          selectedColumns = tableView.columns
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
            // if updating, we normally have loaded the actual row with the loadCurrentRow hook
            // or specified the table_id in the query if its a multiple update
            : context.id === null ? context.params.query?.table_id : context.params._meta.item.table_id
        )
        const columns = await context.app.services.column.find({
          query: { table_id },
          paginate: false
        })
        context.params._meta = {
          ...context.params._meta,
          columns
        }
        break
    }
    return context
  }
};
