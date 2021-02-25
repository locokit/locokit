/* eslint-disable no-case-declarations */
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'
import { SelectValue, TableColumn } from '../../models/tablecolumn.model'

/**
 * Hook updating data for rows related to the current column,
 * via a table_column_relation
 */
export function fillLookedUpColumnInTableRowData (): Hook {
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
          case COLUMN_TYPE.MULTI_USER:
            newDataForCurrentColumn = `
            ('{
              "${context.result.id}": {
                "reference": ' || cast(foreignTableRow.data->'${context.result.settings.foreignField}'->>'reference' as text) || ',
                "value": "' ||
                (
                  SELECT string_agg(trim(userstring::text, '"'), ', ')
                  FROM jsonb_array_elements(foreignTableRow.data->'${context.result.settings.foreignField}'->'value') userstring
                )
                  || '"
              }
            }')::jsonb
            `
            break
          case COLUMN_TYPE.SINGLE_SELECT:
            const options = foreignColumn.settings.values as Record<string, SelectValue>
            const optionsRemapped = Object.keys(options).reduce((acc: Record<string, string>, currentKeyOption) => {
              acc[currentKeyOption] = options[currentKeyOption].label
              return acc
            }, {})
            const optionsJsonString = JSON.stringify(optionsRemapped)
            newDataForCurrentColumn = `
            ('{
              "${context.result.id}": {
                "reference": "' || cast(foreignTableRow.id as text) || '",
                "value": "' || ('${optionsJsonString}'::jsonb->>(foreignTableRow.data->>'${context.result.settings.foreignField}')) || '"
              }
            }')::jsonb
            `
            break
          case COLUMN_TYPE.BOOLEAN:
          case COLUMN_TYPE.DATE:
          case COLUMN_TYPE.FLOAT:
          case COLUMN_TYPE.GEOMETRY_LINESTRING:
          case COLUMN_TYPE.GEOMETRY_POINT:
          case COLUMN_TYPE.GEOMETRY_POLYGON:
          case COLUMN_TYPE.NUMBER:
          case COLUMN_TYPE.STRING:
          case COLUMN_TYPE.TEXT:
          case COLUMN_TYPE.URL:
            newDataForCurrentColumn = `
            ('{
              "${context.result.id}": {
                "reference": "' || cast(foreignTableRow.id as text) || '",
                "value": "' || cast(foreignTableRow.data->>'${context.result.settings.foreignField}' as text) || '"
              }
            }')::jsonb
            `
            break
          default:
            console.log('This column type is not implemented.')
            return context
        }

        const selectRequest = `
        SELECT
          targetTableRows.data ||
          coalesce (${newDataForCurrentColumn}, '{"${context.result.id}":null}'::jsonb) as newData,
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
