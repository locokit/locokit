import {
  Filter,
  FilterAction,
  inputPatternType,
  LckTableViewFilter,
  LckTableViewFilterValue,
} from '../interfaces/toMigrate'
import { formatDateISO, formatDateTimeISO, getDateFromISOString } from './date'

export const COLUMN_TYPE = {
  BOOLEAN: 1,
  STRING: 2,
  NUMBER: 3,
  FLOAT: 4,
  DATE: 5,
  USER: 6,
  GROUP: 7,
  RELATION_BETWEEN_TABLES: 8,
  LOOKED_UP_COLUMN: 9,
  SINGLE_SELECT: 10,
  MULTI_SELECT: 11,
  FORMULA: 12,
  FILE: 13,
  MULTI_USER: 14,
  MULTI_GROUP: 15,
  TEXT: 16,
  URL: 17,
  GEOMETRY_POINT: 18,
  GEOMETRY_POLYGON: 19,
  GEOMETRY_LINESTRING: 20,
  DATETIME: 21,
  GEOMETRY_MULTIPOINT: 22,
  GEOMETRY_MULTIPOLYGON: 23,
  GEOMETRY_MULTILINESTRING: 24,
  VIRTUAL_LOOKED_UP_COLUMN: 25,
}

/**
 * Convert the pattern used in the FilterButton component to a pattern that can be used in FeathersJS or saved into the database.
 * pattern = The filters specified in the FilterButton component
 */
export function getFormattedPattern(
  motif: inputPatternType,
  columnType: number,
  action: FilterAction,
  wildCards: Record<string, string | number> = {},
): boolean | number | string | Array<string | number> {
  if (typeof motif === 'string') {
    // Replace the specific keys containing in the string pattern by the corresponding values
    return (
      wildCards[motif] ||
      (action.patternPrefix ?? '') + motif + (action.patternSuffix ?? '')
    )
  } else if (Array.isArray(motif)) {
    // Replace the specific keys containing in the items of the pattern by the corresponding values
    return motif.map((item) => wildCards[item] || item)
  } else if (motif instanceof Date) {
    if (columnType === COLUMN_TYPE.DATE) {
      // Get the iso string representation of the date
      return formatDateISO(motif)
    } else {
      // Get the iso string representation of the datetime
      return formatDateTimeISO(motif)
    }
  } else {
    return motif as boolean | number | string | Array<string | number>
  }
}

/**
 * Convert the pattern retrieved from the API into another format that can be used in the FilterButton component
 */
export function getPatternFromDatabase(
  pattern: inputPatternType,
  action: FilterAction,
  columnType: number,
) {
  if (action.predefinedPattern !== undefined) {
    // Predefined pattern
    return action.predefinedPattern
  } else if ([COLUMN_TYPE.DATE, COLUMN_TYPE.DATETIME].includes(columnType)) {
    // Date pattern defined by the user
    return getDateFromISOString(pattern) ?? pattern
  } else if (typeof pattern === 'string') {
    // Remove the prefix and the suffix for a string pattern defined by the user
    const fromIndex = action.patternPrefix ? action.patternPrefix.length : 0
    const toIndex = action.patternSuffix?.length
      ? -action.patternSuffix.length
      : undefined
    return pattern.slice(fromIndex, toIndex)
  } else {
    // Just return the pattern defined by the user
    return pattern
  }
}

/**
 * Convert filters used in the FilterButton component to FeathersJS filters
 */
export function getCurrentFilters(
  filters: Filter[],
  wildCards: Record<string, string | number> = {},
) {
  const formattedFilters: Record<string, inputPatternType> = {}
  const cleanedFilters = filters.filter(
    (filter) => ![filter.column, filter.action, filter.motif].includes(null),
  )
  if (cleanedFilters.length > 0) {
    cleanedFilters.forEach(({ operator, column, action, motif }, index) => {
      if (column && action) {
        formattedFilters[
          // Operator
          `${operator}[${index}]` +
            // Field
            ((columnType, originalType) => {
              switch (columnType) {
                case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                  return `[${column.field}.value]`
                case COLUMN_TYPE.LOOKED_UP_COLUMN:
                  switch (originalType) {
                    case COLUMN_TYPE.GROUP:
                    case COLUMN_TYPE.USER:
                    case COLUMN_TYPE.MULTI_USER:
                      return `[${column.field}.reference]`
                    default:
                      return `[${column.field}.value]`
                  }
                case COLUMN_TYPE.USER:
                case COLUMN_TYPE.GROUP:
                case COLUMN_TYPE.MULTI_USER:
                case COLUMN_TYPE.MULTI_GROUP:
                  return `[${column.field}.reference]`
                default:
                  return `[${column.field}]`
              }
            })(column.column_type_id, column.original_type_id) +
            // Action
            `[${action.value}]`
        ] = getFormattedPattern(
          motif,
          column?.original_type_id,
          action,
          wildCards,
        )
      }
    })
  }
  return formattedFilters
}

/**
 * Convert the filters used in the FilterButton component into a lighter format that will be returned to the API
 */
export function convertFiltersToAPI(
  filters: Filter[],
): LckTableViewFilter | null {
  if (filters.length === 0) return null
  const tableViewFilterToSave: LckTableViewFilterValue[] = []
  filters.forEach((filter) => {
    if (
      filter.action != null &&
      filter.column != null &&
      filter.motif != null
    ) {
      tableViewFilterToSave.push({
        action: filter.action.label,
        column: filter.column.field,
        dbAction: filter.action.value,
        pattern: getFormattedPattern(
          filter.motif,
          filter.column.original_type_id,
          filter.action,
        ),
      })
    }
  })
  return {
    operator: filters[0].operator,
    values: tableViewFilterToSave,
  }
}

//
// /**
//  * Convert the filters retrieved from the API into another format that can be used in the FilterButton component
//  */
// export function convertFiltersFromDatabase({
//   columns,
//   filter,
// }: {
//   columns: any[]
//   filter: LckTableViewFilter | null
// }): Filter[] {
//   // Filters that we can use in the FilterButton component and as input of the getCurrentFilters method
//   const allFilters: Filter[] = []
//   if (filter && columns.length > 0) {
//     // Loop on saved in database filters
//     filter.values.forEach(({ column, action, pattern }) => {
//       // Get the column used in the current filter
//       const tableColumn = columns.find((c) => c.id === column)
//
//       if (tableColumn) {
//         const columnType = getColumnTypeId(tableColumn)
//         // Get the action used in the current filter
//         let originalAction = COLUMN_FILTERS_CONFIG[columnType]?.actions.find(
//           (a) => a.label === action,
//         )
//
//         // A looked-up column has specific filters if the original type is not supported
//         if (
//           !originalAction &&
//           tableColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN
//         ) {
//           originalAction = COLUMN_FILTERS_CONFIG[
//             COLUMN_TYPE.LOOKED_UP_COLUMN
//           ].actions.find((a) => a.label === action)
//         }
//
//         if (originalAction) {
//           // Get the pattern used in the current filter
//           const originalPattern = getPatternFromDatabase(
//             pattern,
//             originalAction,
//             columnType,
//           )
//
//           // Add the filter
//           allFilters.push({
//             operator: filter.operator,
//             column: {
//               label: tableColumn.text,
//               originalType: columnType,
//               type: tableColumn.column_type_id,
//               value: column,
//             },
//             action: originalAction,
//             pattern: originalPattern,
//           })
//         }
//       }
//     })
//   }
//   return allFilters
// }
