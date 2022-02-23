import { HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Is the request a bulk patch request ?
 *
 * @param {HookContext} context
 * @returns {boolean} true if the context id is specified, else false.
 */
export function isBulkPatch (context: HookContext): boolean {
  return context.id === null
}

/**
 * Is the request a valid internal bulk patch request ?
 *
 * @param {HookContext} context
 * @returns {boolean} true if the request can be used to patch multiple rows, else false.
 */
export function isValidBulkPatch (context: HookContext): boolean {
  return (
    context.id === null && !context.params.provider && context.params.query?.table_id != null
  )
}

/**
 * Are the updated columns only formula columns ?
 *
 * @param {HookContext} context
 * @returns {boolean} true if the updated columns only are formula columns, else false.
 */
export function onlyUpdateFormulaColumns (context: HookContext): boolean {
  if (Array.isArray(context.params._meta.updatedColumnsWithChildren)) {
    return context.params._meta.updatedColumnsWithChildren.findIndex(
      (column: TableColumn) => column.column_type_id !== COLUMN_TYPE.FORMULA) === -1
  }
  return false
}
