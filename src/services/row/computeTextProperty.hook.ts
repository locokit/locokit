/* eslint-disable no-case-declarations */
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import logger from '../../logger'
import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Compute the text property of a row
 * * need the columns definition, only those marked as "used for reference"
 * * aggregate all values of these columns
 * * transmit it in the text property of the row
 */
export function computeTextProperty (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch (context.method) {
      case 'create':
      case 'update':
      case 'patch':
        const noReference = 'No reference'
        // find if columns ids transmitted are in columns "used for reference"
        const { columns }: { columns: TableColumn[] } = context.params._meta
        // if table don't have columns, we can't compute a reference => go out
        if (columns.length === 0) break
        const columnsUsedForReference = columns.filter((c: TableColumn) => c.reference)
          .sort((a, b) => a.reference_position - b.reference_position)
        // no columns for reference => no reference ?
        let text = ''
        if (columnsUsedForReference.length === 0) {
          // by default, we use the first column which is not a formula
          const firstColumn = columns.find(column => column.column_type_id !== COLUMN_TYPE.FORMULA)
          if (firstColumn) {
            switch (firstColumn.column_type_id) {
              case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
              case COLUMN_TYPE.LOOKED_UP_COLUMN:
                text = context.data.data?.[firstColumn.id]?.value || noReference
                break
              default:
                text = context.data.data?.[firstColumn.id]?.toString() || noReference
            }
          } else {
            text = noReference
          }
        } else {
          columnsUsedForReference.forEach((c: TableColumn, index: number) => {
            text += (index > 0 ? ' ' : '') + context.data.data[c.id]
          })
        }
        context.data.text = context.data.text || text
        break
      default:
        logger.warn('computeTextProperty is not available for method ' + context.method)
    }
    return context
  }
};
