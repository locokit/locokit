/* eslint-disable no-case-declarations */
import { Hook, HookContext } from '@feathersjs/feathers'
import logger from '../../logger'
import { TableColumn } from '../../models/tablecolumn.model'

/**
 * Compute the text property of a row
 * * need the columns definition, only those marked as "used for reference"
 * * aggregate all values of these columns
 * * transmit it in the text property of the row
 */
export function computeTextProperty () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch (context.method) {
      case 'create':
      case 'update':
      case 'patch':
        // find if columns ids transmitted are in columns "used for reference"
        const { columnsIdsTransmitted, columns } = context.params._meta
        console.log(columnsIdsTransmitted, columns)
        const columnsUsedForReference = columns.filter((c: TableColumn) => c.reference)
          .sort((a: TableColumn, b: TableColumn) => a.reference_position > b.reference_position)
        console.log(columnsUsedForReference)
        // no columns for reference => no reference ?
        let text = ''
        if (columnsUsedForReference.length === 0) {
          // by default, we use the first column
          text = context.data.data[columns[0].id]
        } else {
          columnsUsedForReference.forEach((c: TableColumn, index: number) => {
            text += (index > 0 ? ' ' : '') + context.data.data[c.id]
          })
        }
        context.data.text = text
        break
      default:
        logger.warn('computeTextProperty is not available for method ' + context.method)
    }
    return context
  }
};
