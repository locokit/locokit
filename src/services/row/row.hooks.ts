
import * as authentication from '@feathersjs/authentication';
import * as commonHooks from 'feathers-hooks-common'
import filterRowsByTableViewId from '../../hooks/filter-view-rows';
const { authenticate } = authentication.hooks;

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Query } from '@feathersjs/feathers';
import { column as LckColumn, glossary } from '../../models/column.model';
import { row } from '../../models/row.model';
import app from '../../app';
import { ColumnRelation } from '../../models/columnrelation.model';

/**
 * Is the context's data containing the field "data" ?
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
function isDataSent (context: HookContext) {
  return context.data.data
}

/**
 * Load the current row to get all the actual data,
 * if request is a update / patch one.
 */
function loadCurrentRow () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch (context.method) {
      case 'update':
      case 'patch':
        // find the matching row
        context.params._meta = {
          row: await context.service.get(context.id as string)
        }
        break;
    }
    return context;
  };
};

/**
 * Load the columns of the row being inserted / updated.
 */
function loadColumnsDefinition () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch (context.method) {
      case 'create':
      case 'update':
      case 'patch':
        const table_id = (
          context.method === 'create'
            // when creating a row, table_id is mandatory
            ? context.data.table_id
            // if updating, we normally have loaded the actual row
            // with the loadCurrentRow hook
            : context.params._meta.row.table_id
        )
        const columns = await context.app.services.column.find({
          query: { table_id },
        })
        context.params._meta = {
          ...context.params._meta,
          columns: columns.data
        }
        break;
    }
    return context;
  };
};

/**
 * Memorize columns ids sent in the row's data.
 * Useful for the after hook historizeDataEvents
 */
function memorizeColumnsIds (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.data.data) {
      context.params._meta = {
        ...context.params._meta,
        columnsIdsTransmitted: Object.keys(context.data.data)
      }
    }
    return context;
  };
};

function completeDataField (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.data.data) {
      // find the matching row
      const currentRow = await context.service.get(context.id as string)
      // enhance the data object
      context.data.data = {
        ...currentRow.data,
        ...context.data.data
      }
    }
    return context;
  };
};

/**
 * Retrieve the display value
 * for all columns that are "relation between tables"
 * that are transmitted in an create / update / patch request.
 *
 * Need the loadColumnsDefinition hook before.
 */
function enhanceColumnsRelationBetweenTable (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    await Promise.all(
      Object.keys(context.data.data).map(async currentColumnId => {
        // find the matching column
        const currentColumnDefinition = (context.params._meta.columns as LckColumn[]).find((c: LckColumn) => c.id === currentColumnId)
        if (currentColumnDefinition?.column_type_id === glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
          const ref = context.data.data[currentColumnId]
          // retrieve the text value of the matching row
          const matchingRow: row = await context.service.get(ref)
          context.data.data[currentColumnId] = {
            ref,
            value: matchingRow.text
          }
        }
      })
    )
    return context;
  };
};


/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
function completeDefaultValues (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    await Promise.all(
      (context.params._meta.columns as LckColumn[]).map(currentColumnDefinition => {
        if (!context.data.data[currentColumnDefinition.id]) {
          context.data.data[currentColumnDefinition.id] = null
          switch(currentColumnDefinition.column_type_id) {
            case glossary.COLUMN_TYPE.SINGLE_SELECT:
              if ((currentColumnDefinition.settings as any).default) {
                context.data.data[currentColumnDefinition.id] = (currentColumnDefinition.settings as any).default
              }
              break;
          }
        }
      })
    )
    return context;
  };
};

function computeLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // find if some of the columns are linked to other via table_column_relation
    const relations = await context.app.services.columnrelation.find({
      query: {
        column_to_id: {
          $in: context.params._meta.columns.map((c: LckColumn) => (c.id))
        }
      }
    })
    // console.log(relations)
    // await Promise.all(
    //   relations.data.map(async (relation: ColumnRelation) => {
    //     // load the matching column
    //     const columnLinked: LckColumn = await context.app.services.column.get(relation.column_from_id)
    //     // find the row(s) to update
    //     const field =  `(${columnLinked.settings.column_from_id}.ref)`
    //     console.log(
    //       columnLinked.settings.column_from_id as string,
    //       context.result?.data[columnLinked.settings.column_to_id as string].ref,
    //       field
    //     )
    //     const rowsToUpdate = await context.app.services.row.find({
    //       query: {
    //         table_id: columnLinked.table_id as string,
    //         data: {
    //           [columnLinked.settings.column_from_id as string]: {
    //             ref: context.result?.data[columnLinked.settings.column_to_id as string].ref
    //           }
    //         }
    //       }
    //     })
    //     console.log(columnLinked, rowsToUpdate.data.map((r: any) => r.data))
    //   })
    // )
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
    await Promise.all(
      (context.params._meta.columns as LckColumn[])
        .filter(c => c.column_type_id === glossary.COLUMN_TYPE.LOOKED_UP_COLUMN)
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
            console.log('not yet implemented...')
          }
        })
    )
    return context;
  };
}

/**
 * Restrict the removal of a row
 * if all its dependencies are still linked.
 */
function restrictRemoveRow (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    console.log('restrictRemoveRow', context.params.query)
    return context;
  };
}

/**
 * Historize all events on a row :
 * * who create / update it (remove ?)
 * * when
 * * what data
 * * which values (from > to)
 */
function historizeDataEvents (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch(context.method) {
      case 'create':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.create',
          'from:', null,
          'to', context.result
        )
        break;
      case 'update':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.update',
          'from:', context.params._meta.row,
          'to', context.result
        )
        break;
      case 'patch':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.patch',
          'from:',
          context.params._meta.columnsIdsTransmitted.map((columnId: string) => ({
            ref: columnId,
            value: context.params._meta.row.data[columnId]
          })),
          'to:',
          context.params._meta.columnsIdsTransmitted.map((columnId: string) => ({
            ref: columnId,
            value: context.result.data[columnId]
          })),
        )
        break;
    }
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
      commonHooks.iff(isDataSent, enhanceColumnsRelationBetweenTable()),
      computeRowLookedUpColumns(),
      completeDefaultValues(),
    ],
    update: [
      loadCurrentRow(),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      commonHooks.iff(isDataSent, enhanceColumnsRelationBetweenTable()),
      computeRowLookedUpColumns(),
      completeDefaultValues()
    ],
    patch: [
      loadCurrentRow(),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      commonHooks.iff(isDataSent, enhanceColumnsRelationBetweenTable()),
      completeDataField(),
      computeRowLookedUpColumns(),
    ],
    remove: [
      restrictRemoveRow()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      // historizeDataEvents()
      // computeLookedUpColumns()
    ],
    update: [
      // historizeDataEvents()
      // computeLookedUpColumns()
    ],
    patch: [
      // historizeDataEvents()
      // computeLookedUpColumns()
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
