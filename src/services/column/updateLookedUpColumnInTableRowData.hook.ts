import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'
import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Hook updating data for rows related to the current column,
 * via a table_column_relation
 */
export function updateLookedUpColumnInTableRowData (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'create' && context.type === 'after') {
      if (context.result.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
        /**
         * For all rows of the current table, compute this looked up column
         */
        const foreignColumn: TableColumn = await context.app.services.column.get(context.result.settings.foreignField)

        let newDataForCurrentColumn = '{ [context.result.id]: null }'
        switch (foreignColumn.column_type_id) {
          case COLUMN_TYPE.USER:
            newDataForCurrentColumn = `
            ('{ "${context.result.id}":' || cast(foreignTableRow.data->>'${context.result.settings.foreignField}' as text) || ' }')::jsonb
            `
            break
          default:
            newDataForCurrentColumn = `
            ('{
                "${context.result.id}": {
                  "reference": "' || cast(foreignTableRow.id as text) || '",
                  "value": "' || cast(foreignTableRow.data->>'${context.result.settings.foreignField}' as text) || '"
                }
              }')::jsonb
            `
        }

        const selectRequest = `
        SELECT
          targetTableRows.data ||
          coalesce (
            ${newDataForCurrentColumn},
            '{"${context.result.id}":null}'::jsonb
          ) as newData,
          targetTableRows.id
        FROM table_row targetTableRows
        LEFT JOIN table_row_relation foreignTableRelation ON (
          targetTableRows.id = foreignTableRelation.table_row_to_id
          AND foreignTableRelation.table_column_to_id = '${context.result.settings.localField}'
        )
        LEFT JOIN table_row foreignTableRow on (foreignTableRelation.table_row_from_id = foreignTableRow.id)
        WHERE targetTableRows.table_id = '${context.result.table_id}'
        `
        // const resultSelect = await (context.app.get('knex') as Knex).raw(selectRequest)
        // resultSelect.rows.forEach(r => console.log(r))

        const rawRequest = `
          WITH computeNewData as (${selectRequest})
          UPDATE table_row
          SET data = computeNewData.newData
          FROM computeNewData
          WHERE table_row.table_id = '${context.result.table_id}'
          AND table_row.id = computeNewData.id;
        `
        await (context.app.get('knex') as Knex).raw(rawRequest)
      }
    } else {
      console.log('Hook only for create method. For the moment. Need to think about update / patch methods too.')
    }
    return context
  }
};
