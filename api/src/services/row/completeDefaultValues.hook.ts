import { NotAcceptable } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableViewColumn } from '../../models/tableviewcolumn.model'

/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
export function completeDefaultValues (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'create') {
      context.data.data = context.data.data || {}
      await Promise.all((context.params._meta.columns as Array<TableColumn & TableViewColumn>).map(
        async currentColumnDefinition => {
          if (
            typeof context.data.data[currentColumnDefinition.id] === 'undefined' &&
            currentColumnDefinition.column_type_id !== COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN
          ) {
            context.data.data[currentColumnDefinition.id] = null
            switch (currentColumnDefinition.column_type_id) {
              case COLUMN_TYPE.SINGLE_SELECT:
                if (currentColumnDefinition.settings?.default) {
                  context.data.data[currentColumnDefinition.id] = currentColumnDefinition.settings.default
                }
                break
              case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                /**
                 * if we are injecting data for a table_view
                 * maybe we have a default property in the tvhtc,
                 * so in the currentColumnDefinition that is TableColumn enhanced
                 * with tvhtc properties
                 */
                if (currentColumnDefinition.default) {
                  const dataQuery: Record<string, any> = {}
                  Object.keys(currentColumnDefinition.default).forEach(key => {
                    let filterValue = ((currentColumnDefinition.default as Record<string, any>)[key] as string)
                      .replace('{userId}', context.params.user?.id)

                    if (filterValue.includes('{groupId}') && !context.data.$lckGroupId) {
                      throw new NotAcceptable('$lckGroupId needed for this request. Please provide it.')
                    }
                    filterValue = filterValue.replace('{groupId}', context.data.$lckGroupId)
                    dataQuery[key] = filterValue
                  })
                  const referencedRow = await context.app.service('row').find({
                    query: {
                      data: dataQuery,
                      table_id: currentColumnDefinition.settings.tableId,
                    },
                    paginate: false,
                  })
                  if (referencedRow.length === 1) {
                    context.data.data[currentColumnDefinition.id] = {
                      reference: referencedRow[0].id,
                      value: referencedRow[0].text,
                    }
                    /**
                     * For Relation between tables,
                     * we add this column id to help
                     * the computeRowLookedUpColumns hook
                     */
                    context.params._meta.columnsIdsTransmitted.push(currentColumnDefinition.id)
                  } else {
                    throw new NotAcceptable('Too much or none matching results for default value on column ' + currentColumnDefinition.text)
                  }
                }
                break
              case COLUMN_TYPE.BOOLEAN:
                // A boolean value is false by default except if we specified a default value in the settings column
                context.data.data[currentColumnDefinition.id] = currentColumnDefinition.settings?.default === true
                break
            }
          }
        }))
    }
    return context
  }
};
