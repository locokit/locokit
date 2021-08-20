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
        let text = ''
        if (columnsUsedForReference.length === 0) {
          // by default, we use the first column which is not a formula or a multi
          const firstColumn = columns.find(column => ![
            COLUMN_TYPE.FORMULA,
            COLUMN_TYPE.MULTI_USER,
            COLUMN_TYPE.MULTI_GROUP,
            COLUMN_TYPE.MULTI_SELECT,
          ].includes(column.column_type_id))
          if (firstColumn) {
            switch (firstColumn.column_type_id) {
              case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
              case COLUMN_TYPE.LOOKED_UP_COLUMN:
              case COLUMN_TYPE.USER:
              case COLUMN_TYPE.GROUP:
                text = (context.data.data[firstColumn.id]?.value || noReference) as string
                break
              default:
                text = context.data.data?.[firstColumn.id]?.toString() || noReference
            }
          } else {
            text = noReference
          }
        } else {
          for (const column of columnsUsedForReference) {
            const index: number = columnsUsedForReference.indexOf(column)
            if (context.data.data[column.id] || (columnsUsedForReference.length === 1 && column.column_type_id === COLUMN_TYPE.FORMULA)) {
              text += (index > 0 ? ' ' : '')
              switch (column.column_type_id) {
                case COLUMN_TYPE.FORMULA:
                  // Authorize only formula of type string or text
                  // This value it's always at null when we create
                  // And when we update/patch the value it's always the previous value
                  // Because formula is computed after commit the request
                  // So text is generated in computeRowFormulaColumns.ts for this case
                  // But this allow to set reference when we duplicated a row
                  if (context.data.data[column.id] && column.settings.formula_type_id && ([COLUMN_TYPE.TEXT, COLUMN_TYPE.STRING].includes(column.settings.formula_type_id) && column.settings.formula)) {
                    text += (context.data.data[column.id].toString()) as string
                  }
                  break
                case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                case COLUMN_TYPE.LOOKED_UP_COLUMN:
                case COLUMN_TYPE.USER:
                case COLUMN_TYPE.GROUP:
                  text += (context.data.data[column.id]?.value || '') as string
                  break
                case COLUMN_TYPE.DATETIME:
                  text += new Date((context.data.data[column.id].toString()) as string).toLocaleDateString()
                  break
                case COLUMN_TYPE.DATE:
                  text += new Date((context.data.data[column.id].toString()) as string).toLocaleString()
                  break
                default:
                  text += (context.data.data[column.id].toString()) as string
                  break
              }
            }
          }
        }
        context.data.text = context.data.text || text || noReference
        break
      default:
        logger.warn('computeTextProperty is not available for method ' + context.method)
    }
    return context
  }
}
