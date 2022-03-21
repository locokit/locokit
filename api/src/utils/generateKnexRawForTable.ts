import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'
import { Table } from '../models/table.model'
import { SelectValue, TableColumn } from '../models/tablecolumn.model'
import { getLatestParent } from './getFieldLatestParent'
import { toSnakeCase } from './toSnakeCase'

/**
 * Generate an SQL view for a table in dedicated schema.
 *
 * Useful for tools that need to make SQL queries
 * without headaches concerning the JSONB columns of the `row` service.
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export async function generateSQLView (table: Table, schemaName: string, knex: Knex): Promise<Knex.RawBuilder> {
  /**
   * Retrieve all columns of the table
   */
  const columns = table.columns as TableColumn[]
  const viewName = table.slug as string || toSnakeCase(table.text) as string

  const sqlDrop = 'DROP VIEW IF EXISTS ??.??;\n'
  const bindingsDrop = []
  bindingsDrop.push(schemaName)
  bindingsDrop.push(viewName)

  const sqlCreate = 'CREATE OR REPLACE VIEW ??.?? as \n'
  const bindingsCreate = []
  bindingsCreate.push(schemaName)
  bindingsCreate.push(viewName)
  let sqlSelect = 'SELECT \n'
  let sqlFrom = 'FROM public.table_row AS table_source\n'
  // const bindingsFrom: Knex.Raw<any>[] = []

  const columnsToJoin: any[] = []

  const columnsName: Record<string, number> = {}

  columns.forEach(function (currentColumn: TableColumn) {
    const originalTypeId = currentColumn.originalTypeId()
    let columnName = toSnakeCase(currentColumn.text)
    if (columnsName[columnName] !== null && columnsName[columnName] !== undefined) {
      columnsName[columnName]++
      columnName += `_${columnsName[columnName] - 1}`
    } else {
      columnsName[columnName] = 1
    }
    let casting = '::TEXT'
    switch (originalTypeId) {
      case COLUMN_TYPE.BOOLEAN:
        casting = '::BOOLEAN'
        break
      case COLUMN_TYPE.DATE:
        casting = '::DATE'
        break
      case COLUMN_TYPE.DATETIME:
        casting = '::TIMESTAMP'
        break
      case COLUMN_TYPE.NUMBER:
        casting = '::INTEGER'
        break
      case COLUMN_TYPE.FLOAT:
        casting = '::DOUBLE PRECISION'
        break
      case COLUMN_TYPE.GEOMETRY_LINESTRING:
      case COLUMN_TYPE.GEOMETRY_POINT:
      case COLUMN_TYPE.GEOMETRY_POLYGON:
      case COLUMN_TYPE.GEOMETRY_MULTILINESTRING:
      case COLUMN_TYPE.GEOMETRY_MULTIPOINT:
      case COLUMN_TYPE.GEOMETRY_MULTIPOLYGON:
        casting = '::GEOMETRY'
        break
    }
    switch (currentColumn.column_type_id) {
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
      case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        switch (originalTypeId) {
          case COLUMN_TYPE.MULTI_USER:
          case COLUMN_TYPE.USER:
          case COLUMN_TYPE.GROUP:
            // Keep the same reference and the same value that the related looked-up column
            sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'value' as ??,\n`
            sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'reference' as ??,\n`

            break
          case COLUMN_TYPE.SINGLE_SELECT:
            const latestParentSS = getLatestParent(currentColumn)
            const values: Record<string, string> = {}
            Object.keys(latestParentSS.settings.values as Record<string, SelectValue>).forEach(function (value) {
              values[value] = (latestParentSS.settings.values as Record<string, SelectValue>)[value].label
            })
            sqlSelect += `\t'${JSON.stringify(values).replaceAll('\'', '\'\'') as string}'::json->>(table_source.data->'${currentColumn.id as string}'->>'value') as ??,\n`
            sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'reference' as ??,\n`
            break
          case COLUMN_TYPE.MULTI_SELECT:
            const latestParentMS = getLatestParent(currentColumn)
            let replaceFunction = `replace(replace(table_source.data->'${currentColumn.id as string}'->>'value', '[', ''), ']', '')`
            Object.keys(latestParentMS.settings.values as Record<string, SelectValue>).forEach(function (value) {
              const label = (latestParentMS.settings.values as Record<string, SelectValue>)[value].label.replace('\'', '\'\'')
              replaceFunction = `replace(${replaceFunction}, '"${value}"', '${label as string}')`
            })
            sqlSelect += `\t${replaceFunction} as ??,`
            sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'reference' as ??,\n`
            break
          case COLUMN_TYPE.BOOLEAN:
          case COLUMN_TYPE.DATE:
          case COLUMN_TYPE.NUMBER:
          case COLUMN_TYPE.FLOAT:
          case COLUMN_TYPE.GEOMETRY_LINESTRING:
          case COLUMN_TYPE.GEOMETRY_POINT:
          case COLUMN_TYPE.GEOMETRY_POLYGON:
          default:
            sqlSelect += `\t(table_source.data->'${currentColumn.id as string}'->>'value')${casting} as ??,\n`
            sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'reference' as ??,\n`
            break
        }
        bindingsCreate.push(columnName)
        bindingsCreate.push(columnName + '_reference')
        break
      case COLUMN_TYPE.USER:
      case COLUMN_TYPE.GROUP:
        sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'value' as ??,\n`
        sqlSelect += `\ttable_source.data->'${currentColumn.id as string}'->>'reference' as ??,\n`
        bindingsCreate.push(columnName)
        bindingsCreate.push(columnName + '_reference')
        break
      case COLUMN_TYPE.MULTI_SELECT:
        let replaceFunction = `replace(replace(table_source.data->>'${currentColumn.id as string}', '[', ''), ']', '')`
        Object.keys(currentColumn.settings.values as Record<string, SelectValue>).forEach(function (value) {
          const label = (currentColumn.settings.values as Record<string, SelectValue>)[value].label.replace('\'', '\'\'')
          replaceFunction = `replace(${replaceFunction}, '"${value}"', '${label as string}')`
        })
        sqlSelect += `\t${replaceFunction} as ??,`
        sqlSelect += `\ttable_source.data->>'${currentColumn.id as string}' as ??,\n`
        bindingsCreate.push(columnName)
        bindingsCreate.push(columnName + '_reference')
        break
      case COLUMN_TYPE.BOOLEAN:
      case COLUMN_TYPE.DATE:
      case COLUMN_TYPE.NUMBER:
      case COLUMN_TYPE.FLOAT:
      case COLUMN_TYPE.GEOMETRY_LINESTRING:
      case COLUMN_TYPE.GEOMETRY_POINT:
      case COLUMN_TYPE.GEOMETRY_POLYGON:
      case COLUMN_TYPE.STRING:
      case COLUMN_TYPE.TEXT:
      case COLUMN_TYPE.URL:
      case COLUMN_TYPE.FORMULA:
        sqlSelect += `\t(table_source.data->>'${currentColumn.id as string}')${casting} as ??,\n`
        bindingsCreate.push(columnName)
        break
      case COLUMN_TYPE.SINGLE_SELECT:
        const singleSelectValues: Record<string, string> = {}
        Object.keys(currentColumn.settings.values as Record<string, SelectValue>).forEach(function (value) {
          singleSelectValues[value] = (currentColumn.settings.values as Record<string, SelectValue>)[value].label
        })
        sqlSelect += `\t'${JSON.stringify(singleSelectValues).replaceAll('\'', '\'\'') as string}'::json->>(table_source.data->>'${currentColumn.id as string}') as ??,\n`
        bindingsCreate.push(columnName)
        break
      case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
        sqlSelect += `\t(table_linked_${columnsToJoin.length}.data->>'${currentColumn.settings.foreignField as string}')${casting} as ??,\n`
        bindingsCreate.push(columnName)
        columnsToJoin.push(currentColumn)
        break
      default:
        sqlSelect += `\t(table_source.data->>'${currentColumn.id as string}')${casting} as ??,\n`
        bindingsCreate.push(columnName)
    }
  })

  // remove the last comma
  sqlSelect = sqlSelect.substring(0, sqlSelect.lastIndexOf(',')) + '\n'

  let sqlWhere = `WHERE table_source.table_id = '${table.id}'\n`

  // add joins for rbt / luc / vluc
  columnsToJoin.forEach(function (currentColumn, index) {
    sqlFrom += `LEFT OUTER JOIN public.table_row as table_linked_${index}\n`
    sqlFrom += `\tON table_linked_${index}.table_id = '${currentColumn.settings.tableId as string}' \n`
    sqlWhere += `\tAND (table_source.data->'${currentColumn.settings.localField as string}'->>'reference')::uuid = table_linked_${index}.id\n`
  })

  // await (context.app.get('knex') as Knex).raw(sqlDrop, bindingsDrop).debug(true)

  const sql = sqlCreate + sqlSelect + sqlFrom + sqlWhere + ';'

  await knex.raw(sqlDrop, bindingsDrop)

  return await knex.raw(sql, bindingsCreate)
}
