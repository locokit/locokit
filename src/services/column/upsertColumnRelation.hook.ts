import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableColumnRelation } from '../../models/tablecolumnrelation.model'

/**
 * Hook exclusive to create (LOOKED_UP_COLUMN and FORMULA) and patch / update (FORMULA).
 * Add relations between columns for the LOOKED_UP_COLUMNS (which display the linked columns)
 * and the FORMULAS (which use the linked columns).
 */
export function upsertColumnRelation (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // LOOKED_UP_COLUMN
    if (context.result.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
      // On create
      if (context.method === 'create') {
        await context.app.services.columnrelation.create({
          table_column_from_id: context.result.settings.foreignField,
          table_column_to_id: context.result.id,
        })
      } else {
        console.log('Hook only for create method. For the moment. Need to think about update / patch methods too.')
      }
    // FORMULA
    } else if (context.result.column_type_id === COLUMN_TYPE.FORMULA) {
      const columnsIdsUsedInFormula = (context.params._meta?.formulaColumns as TableColumn[] || []).map(column => column.id)
      if (context.method === 'create' && columnsIdsUsedInFormula.length > 0) {
        // On create
        await context.app.service('columnrelation').create(
          columnsIdsUsedInFormula.map(columnIdUsedInFormula => ({
            table_column_from_id: columnIdUsedInFormula,
            table_column_to_id: context.result.id
          })),
          { query: { $noSelect: true } }
        )
      } else if (['patch', 'update'].includes(context.method)) {
        // On update
        const notUsedColumnsFromId: string[] = []

        // Some columns are specified in the formula
        if (columnsIdsUsedInFormula.length > 0) {
          // Find existing column relations
          const existingColumnsRelations: TableColumnRelation[] = await context.app.services.columnrelation.find({
            query: {
              table_column_to_id: context.result.id
            },
            paginate: false
          })

          // Check that the previous relations are still used
          existingColumnsRelations.forEach(columnRelation => {
            const indexColumnIdUsedInFormula = columnsIdsUsedInFormula.findIndex(
              id => id === columnRelation.table_column_from_id
            )
            if (indexColumnIdUsedInFormula > -1) {
              // The column was already used in the formula so we don't want to create a duplicate relation
              columnsIdsUsedInFormula.splice(indexColumnIdUsedInFormula, 1)
            } else {
              // The column is not used anymore in the formula so we will delete them
              notUsedColumnsFromId.push(columnRelation.table_column_from_id)
            }
          })
          // Create the new relations if necessary
          if (columnsIdsUsedInFormula.length > 0) {
            await context.app.service('columnrelation').create(
              columnsIdsUsedInFormula.map(columnIdUsedInFormula => ({
                table_column_from_id: columnIdUsedInFormula,
                table_column_to_id: context.result.id
              })),
              { query: { $noSelect: true } }
            )
          }
          // Delete previous relations that are not used anymore if necessary
          if (notUsedColumnsFromId.length > 0) {
            await context.app.service('columnrelation').remove(null, {
              query: {
                table_column_to_id: context.result.id,
                table_column_from_id: {
                  $in: notUsedColumnsFromId
                },
                $limit: notUsedColumnsFromId.length,
                $noSelect: true
              }
            })
          }
        } else {
          // No column is specified in the formula --> we simply search and delete the previous relations if they exist
          await context.app.service('columnrelation').remove(null, {
            query: {
              table_column_to_id: context.result.id,
              $noSelect: true
            }
          })
        }
      }
    }
    return context
  }
};
