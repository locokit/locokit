
import * as authentication from '@feathersjs/authentication';
import * as commonHooks from 'feathers-hooks-common'
import filterRowsByTableViewId from '../../hooks/filter-view-rows';
import { isDataSent } from '../../hooks/lck-hooks/isDataSent'
import { getCurrentItem } from '../../hooks/lck-hooks/getCurrentItem'
const { authenticate } = authentication.hooks;

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Query } from '@feathersjs/feathers';
import { column as LckColumn, SingleSelectValue } from '../../models/column.model';
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { row, RowData } from '../../models/row.model';
import { ColumnRelation } from '../../models/columnrelation.model';
import { enhanceComplexColumns } from '../../hooks/lck-hooks/enhanceComplexColumns';
import { loadColumnsDefinition } from '../../hooks/lck-hooks/loadColumnsDefinition';
import { LCK_trr } from '../../models/trr.model';


/**
 * Memorize columns ids sent in the row's data.
 * Useful for the after hook historizeDataEvents.
 *
 * We have to memorize them before "completing" data field.
 */
function memorizeColumnsIds (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    context.params._meta = {
      ...context.params._meta,
      columnsIdsTransmitted: Object.keys(context.data.data || {})
    }
    return context;
  };
};

/**
 * Complete the data field of a row,
 * useful when patching a row,
 * to avoid an erase of all column values.
 */
function completeDataField (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method !== 'patch') return context
    if (
      context.data.data &&
      context.params._meta?.item?.data
    ) {
      // find the matching row
      // const currentRow = await context.service.get(context.id as string)
      // enhance the data object
      context.data.data = {
        ...context.params._meta.item.data,
        ...context.data.data
      }
    }
    return context;
  };
};

/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
function completeDefaultValues (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'create') {
      await Promise.all(
        (context.params._meta.columns as LckColumn[]).map(currentColumnDefinition => {
          if (!context.data.data[currentColumnDefinition.id]) {
            context.data.data[currentColumnDefinition.id] = null
            switch(currentColumnDefinition.column_type_id) {
              case COLUMN_TYPE.SINGLE_SELECT:
                if ((currentColumnDefinition.settings as any).default) {
                  context.data.data[currentColumnDefinition.id] = (currentColumnDefinition.settings as any).default
                }
                break;
            }
          }
        })
      )
    }
    return context;
  };
};

/**
 * Hook updating looked up columns linked to the current row
 * * by a field updated for the current row (tcr.table_column_from_id)
 * *
 */
function computeLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // first, find rows linked to this current row (trr.table_row_from_id)
    const linkedRows = await context.app.services.trr.find({
      query: {
        table_row_from_id: context.result.id
      }
    })

    // find if some of the columns are linked to other via table_column_relation
    const linkedColumns = await context.app.services.columnrelation.find({
      query: {
        table_column_from_id: {
          $in: context.params._meta.columnsIdsTransmitted
        }
      }
    })

    // update each linked row, by setting the new value for all columns related to this row
    await Promise.all((linkedRows.data as LCK_trr[]).map(async (currentRowRelation: LCK_trr) => {
      const currentRow = await context.service.get(currentRowRelation.table_row_to_id)
      const columnDataKeysForCurrentRow = Object.keys(currentRow.data)
      const columnsToUpdate = (linkedColumns.data as ColumnRelation[]).filter(c => columnDataKeysForCurrentRow.indexOf(c.table_column_to_id) > -1)
      const newData: Record<string, {
        reference: string,
        value: string
      }> = {}
      columnsToUpdate.forEach(c => {
        newData[c.table_column_to_id] = {
          reference: context.result.id,
          value: context.result.data[c.table_column_from_id]
        }
      })
      await context.service.patch(currentRow.id, {
        data: newData
      })
    }))
    return context;
  };
}

/**
 * Compute the looked up columns for the current row,
 * if some of the depedencies of the looked up columns
 * are in the data currently sent.
 * (that means one of the dependency of the looked up column has mutated => refresh the computed value)
 */
function computeRowLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.method === 'patch' &&
      !context.data.data
    ) return context;
    await Promise.all(
      (context.params._meta.columns as LckColumn[])
        .filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
        .map(async currentColumnDefinition => {
          const foreignColumn: LckColumn = await context.app.services.column.get(currentColumnDefinition.settings.foreignField as string)
          const foreignColumnTypeId = foreignColumn.column_type_id
          const foreignRowId: { reference: string, value: string } = context.data.data[currentColumnDefinition.settings.localField as string]
          if (foreignRowId?.reference) {
            const matchingRow: row = await context.service.get(foreignRowId?.reference)
            const currentColumnData: RowData = {
              reference: foreignRowId.reference,
              value: matchingRow.data[currentColumnDefinition.settings.foreignField as string] as { reference: string, value: string }
            }
            /**
             * In the case of a foreign column "SINGLE_SELECT", we have to duplicate the SINGLE_SELECT label for display
             */
            if (typeof currentColumnData.value === 'string' && foreignColumnTypeId === COLUMN_TYPE.SINGLE_SELECT) {
              currentColumnData.value = (foreignColumn.settings.values as Record<string, SingleSelectValue>)[currentColumnData.value].label
            } else
            /**
             * If the value is an object, we retrieve the sub property of value
             */
            if (typeof currentColumnData.value === 'object') {

              currentColumnData.reference = currentColumnData.value?.reference
              currentColumnData.value = currentColumnData.value?.value
            }
            context.data.data[currentColumnDefinition.id] = currentColumnData
          }
        })
    )
    return context;
  };
}

/**
 * Compute the formula of the columns
 */
function computeRowFormulaColumns () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    await Promise.all(
      (context.params._meta.columns as LckColumn[])
        .filter(c => c.column_type_id === COLUMN_TYPE.FORMULA)
        .map(currentColumnDefinition => {
          if (currentColumnDefinition.settings.formula) {
            const formula = currentColumnDefinition.settings.formula
            // only the formula {{ $columns[columnId] }} is recognized, need a lexical parser
            const newFormula = formula.replace(/{{\ ?\$column\['([a-z0-9\-]*)'\]\ ?}}/,
              function replacer(match, columnId) {
                if (context.data.data[columnId]) {
                  return context.data.data[columnId]
                } else {
                  return ''
                }
              })
            try {
              context.data.data[currentColumnDefinition.id] = eval(newFormula)
            } catch (error) {
              // TODO: historize or send to sentry
              console.error(error)
            }
          } else {
            // console.log(currentColumnDefinition.settings)
            console.log('not yet implemented...')
          }
        })
    )
    return context;
  };
}

/**
 * Create / Update the table_row_relation if needed
 */
function upsertRowRelation (): Hook {
  return async (context: HookContext): Promise<HookContext> => {

    await Promise.all(
      ( context.params._meta.columnsIdsTransmitted as string[])
      .filter(currentColumnId => {
        // find the matching column
        const currentColumnDefinition = (context.params._meta.columns as LckColumn[]).find((c: LckColumn) => c.id === currentColumnId)
        // check if it's a RELATION_BETWEEN_TABLE
        return currentColumnDefinition?.column_type_id === COLUMN_TYPE.RELATION_BETWEEN_TABLES
      })
      .map(async currentColumnId => {
        // check if there is alreay a trr for the current row id + currentColumnId
        const matchingRows = await context.app.services.trr.find({
          query: {
            table_row_to_id: context.result.id,
            table_column_to_id: currentColumnId
          }
        })
        const tableRowFromId = context.result.data[currentColumnId].reference
        // if the trr doesn't exist, create it
        if (matchingRows.total === 0) {
          await context.app.services.trr.create({
            table_row_to_id: context.result.id,
            table_column_to_id: currentColumnId,
            table_row_from_id: tableRowFromId
          })
        } else if (matchingRows.total === 1) {
          // if the from is different, update this line
          if (matchingRows.data[0].table_row_from_id !== tableRowFromId) {
            await context.app.services.trr.patch({
              table_row_to_id: context.result.id,
              table_column_to_id: currentColumnId,
            }, {
              table_row_from_id: tableRowFromId
            })
          }
          // else do nothing
        } else {
          throw new Error('Too much matching rows ?')
        }
      })
    )

    return context;
  };
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      filterRowsByTableViewId(),
      commonHooks.discardQuery('table_view_id')
    ],
    get: [],
    create: [
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      computeRowLookedUpColumns(),
      completeDefaultValues()
    ],
    update: [
      getCurrentItem(),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      computeRowLookedUpColumns(),
      completeDefaultValues()
    ],
    patch: [
      getCurrentItem(),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      completeDataField(),
      computeRowLookedUpColumns()
    ],
    remove: [
      commonHooks.disallow()
    ]
  },

  after: {
    all: [
      // historizeDataEvents()
    ],
    find: [],
    get: [],
    create: [
      upsertRowRelation(),
      computeLookedUpColumns()
    ],
    update: [
      upsertRowRelation(),
      computeLookedUpColumns()
    ],
    patch: [
      upsertRowRelation(),
      computeLookedUpColumns()
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
