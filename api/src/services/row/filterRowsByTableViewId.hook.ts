// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { LckColumnFilter, TableColumnDTO } from '../../models/tablecolumn.model'
import { TableView } from '../../models/tableview.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { NotAcceptable } from '@feathersjs/errors'

interface QueryFilter {
  data: Record<string, Record<string, string | number | boolean | Array<string|number>>>
}

/**
 * Add filters depending on the table view wished
 */
export default function filterRowsByTableViewId (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params.query?.table_view_id) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { table_view_id } = context.params.query
      const tableView: TableView = await context.app.services.view.get(table_view_id, {
        query: {
          $eager: '[columns.[parents]]',
        },
        paginate: false,
      })
      const filtersToAdd: { [key: string]: Object } = {};
      // Add filters coming from table view columns settings
      (tableView.columns as TableColumnDTO[])
        .filter((c: TableColumnDTO) => c.filter)
        .forEach((c: TableColumnDTO) => {
          Object.keys((c.filter as LckColumnFilter)).forEach(filterKey => {
            let currentFilterKeyValue = (c.filter as LckColumnFilter)[filterKey]
            switch (filterKey) {
              case '$eq':
                if (typeof (c.filter as LckColumnFilter)[filterKey] === 'string') {
                  currentFilterKeyValue = (
                    (c.filter as LckColumnFilter)[filterKey] as string
                  ).replace('{userId}', context.params.user?.id)
                    .replace('{rowId}', context.params?.query?.rowId)
                  if ((currentFilterKeyValue as string).includes('{groupId}') && !context.params?.query?.$lckGroupId) {
                    throw new NotAcceptable('$lckGroupId needed for this request. Please provide it.')
                  }
                  currentFilterKeyValue = (currentFilterKeyValue as string).replace('{groupId}', context.params?.query?.$lckGroupId)
                }

                switch (c.column_type_id) {
                  case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                  case COLUMN_TYPE.LOOKED_UP_COLUMN:
                  case COLUMN_TYPE.GROUP:
                  case COLUMN_TYPE.USER:
                    filtersToAdd[c.id + '.reference'] = currentFilterKeyValue
                    break
                  case COLUMN_TYPE.SINGLE_SELECT:
                  default:
                    filtersToAdd[c.id] = currentFilterKeyValue
                    break
                }
                break
              case '$contains':
                currentFilterKeyValue = (currentFilterKeyValue as []).map(item => {
                  switch (item) {
                    case '{userId}':
                      return context.params.user?.id
                    case '{groupId}':
                      if (!context.params?.query?.$lckGroupId) {
                        throw new NotAcceptable('$lckGroupId needed for this request. Please provide it.')
                      }
                      return context.params?.query?.$lckGroupId
                    default:
                      return item
                  }
                })
                if (c.column_type_id === COLUMN_TYPE.MULTI_SELECT) {
                  filtersToAdd[c.id] = { [filterKey]: currentFilterKeyValue }
                } else {
                  filtersToAdd[c.id + '.reference'] = { [filterKey]: currentFilterKeyValue }
                }
                break
              default:
                filtersToAdd[c.id] = { [filterKey]: currentFilterKeyValue }
                break
            }
          })
        })
      // Add default filters coming from table view settings
      if (tableView.filter) {
        const { operator, values } = tableView.filter
        if (values.length > 0) {
          // List that will contain all the filters
          const defaultFilters: QueryFilter[] = []

          // Get the values of the specific keys that can be included in the filter patterns
          const wildCards: Record<string, string | undefined> = {
            '{userId}': context.params.user?.id,
            '{groupId}': context.params.query?.$lckGroupId,
            '{rowId}': context.params.query?.rowId,
          }

          values.forEach(({ column, dbAction, pattern }) => {
            const currentColumn = (tableView.columns as TableColumnDTO[]).find(c => c.id === column)

            if (!currentColumn) {
              throw new NotAcceptable('Invalid column: the specified column is unknown.')
            }

            // Format the column key in case of complex value for some column types
            let columnKey = column

            const originalType = currentColumn.originalTypeId()

            switch (currentColumn.column_type_id) {
              case COLUMN_TYPE.GROUP:
              case COLUMN_TYPE.USER:
              case COLUMN_TYPE.MULTI_USER:
                columnKey += '.reference'
                break
              case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                columnKey += '.value'
                break
              case COLUMN_TYPE.LOOKED_UP_COLUMN:
                switch (originalType) {
                  case COLUMN_TYPE.GROUP:
                  case COLUMN_TYPE.USER:
                  case COLUMN_TYPE.MULTI_USER:
                    columnKey += '.reference'
                    break
                  default:
                    columnKey += '.value'
                }
                break
            }

            let formattedPattern = pattern

            // Format the pattern to replace some keys ({userId} / {groupId} / {rowId}) by the current values
            if (typeof formattedPattern === 'string') {
              formattedPattern = replaceKeyByValue(formattedPattern, wildCards)
            } else if (Array.isArray(formattedPattern)) {
              formattedPattern = formattedPattern.map(item => typeof item === 'string'
                ? replaceKeyByValue(item, wildCards)
                : item,
              )
            }

            // Add the FeatherJS query filter
            defaultFilters.push({
              data: {
                [columnKey]: {
                  [dbAction]: formattedPattern,
                },
              },
            })
          })
          // Add default filters to the query
          const allFilters: Array<Record<string, QueryFilter[]>> = [{ [operator]: defaultFilters }]
          if (context.params.query.$or) allFilters.push({ $or: context.params.query.$or })
          if (context.params.query.$and) allFilters.push({ $and: context.params.query.$and })
          if (allFilters.length > 1) {
            // If a filter operator is already specified -> make a conjonction of the specified and the default filters
            context.params.query.$and = allFilters
            delete context.params.query.$or
          } else {
            // If there is no specified filter operator -> simply add the default filters
            context.params.query[operator] = defaultFilters
          }
        }
      }

      context.params.query = {
        ...context.params.query,
        table_id: tableView.table_id,
        data: {
          ...context.params.query.data,
          ...filtersToAdd,
        },
      }
    }
    return context
  }
};

/**
 * Return the value related to a specific key if the pattern is equal to the key, else return the input pattern.
 * @param pattern The original pattern to analyze.
 * @param replacements An object associating the specific keys to found with their replacements.
 * @returns The value related to a specific key if the pattern is known, else just return the input pattern.
 */
function replaceKeyByValue (pattern: string, replacements: Record<string, string | number | undefined>): string | number {
  if (Object.prototype.hasOwnProperty.call(replacements, pattern)) {
    // The pattern is recognized
    const value = replacements[pattern]
    if (value) {
      // And defined
      return value
    } else {
      // But undefined
      throw new NotAcceptable(`${pattern} needed for this request. Please provide it.`)
    }
  } else {
    // The pattern is not recognized so we just return it
    return pattern
  }
}
