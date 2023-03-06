// Interfaces
import { formatDateISO, formatDateTimeISO, getDateFromISOString } from './date'

// const { t } = useI18n({ useScope: 'global' })

export const OPERATORS = [
  {
    label: 'or',
    value: '$or',
  },
  {
    label: 'and',
    value: '$and',
  },
]

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
type inputPatternType =
  | boolean
  | number
  | string
  | Array<string | number>
  | Date
  | null

export type LckTableViewFilterPattern =
  | boolean
  | number
  | string
  | Array<string | number>

export interface LckTableViewFilterValue {
  action: string
  column: string
  dbAction: string
  pattern: LckTableViewFilterPattern
}

export interface LckTableViewFilter {
  operator: string
  values: LckTableViewFilterValue[]
}

export interface FilterAction {
  label: string
  value: string
  predefinedPattern?: string | number | boolean | string[]
  patternPrefix?: string
  patternSuffix?: string
}

export interface Filter {
  operator: string
  column: null | {
    name: string
    slug: string
    original_type_id: number
    column_type_id: number
  }
  action: FilterAction | null
  motif: inputPatternType
}

// Available actions
// Each one must have a "label" used for translation and a "value" corresponding to the FeatherJS Query Operators.
// The "predefinedPattern" attribute is used to give a value to an implicit pattern.
export const ACTIONS: Record<string, FilterAction> = {
  MATCH: {
    label: 'match',
    value: '$like',
    patternPrefix: '%',
    patternSuffix: '%',
  },
  NOT_MATCH: {
    label: 'doesNotMatch',
    value: '$notILike',
    patternPrefix: '%',
    patternSuffix: '%',
  },
  EQUAL: {
    label: 'isEqualTo',
    value: '$eq',
  },
  NOT_EQUAL: {
    label: 'isDifferentFrom',
    value: '$ne',
  },
  IN: {
    label: 'in',
    value: '$in',
  },
  NOT_IN: {
    label: 'notIn',
    value: '$nin',
  },
  ALL: {
    label: 'all',
    value: '$all',
  },
  ANY: {
    label: 'any',
    value: '$any',
  },
  EMPTY: {
    label: 'isEmpty',
    value: '$null',
    predefinedPattern: true,
  },
  NOT_EMPTY: {
    label: 'isNotEmpty',
    value: '$notNull',
    predefinedPattern: true,
  },
  TRUE: {
    label: 'isTrue',
    value: '$eq',
    predefinedPattern: true,
  },
  FALSE: {
    label: 'isFalse',
    value: '$eq',
    predefinedPattern: false,
  },
  GREATER_THAN: {
    label: 'isGreaterThan',
    value: '$gt',
  },
  LOWER_THAN: {
    label: 'isLowerThan',
    value: '$lt',
  },
  GREATER_EQUAL_THAN: {
    label: 'isGreaterThanOrEqualTo',
    value: '$gte',
  },
  LOWER_EQUAL_THAN: {
    label: 'isLowerThanOrEqualTo',
    value: '$lte',
  },
  START_WITH: {
    label: 'startWith',
    value: '$ilike',
    patternSuffix: '%',
  },
  END_WITH: {
    label: 'endWith',
    value: '$ilike',
    patternPrefix: '%',
  },
  EARLIER_THAN: {
    label: 'isEarlierThan',
    value: '$lt',
  },
  EARLIER_EQUAL_THAN: {
    label: 'isEarlierThanOrEqualTo',
    value: '$lte',
  },
  LATER_THAN: {
    label: 'isLaterThan',
    value: '$gt',
  },
  LATER_EQUAL_THAN: {
    label: 'isLaterThanOrEqualTo',
    value: '$gte',
  },
  IS_LOGGED_USER: {
    label: 'isLoggedInUser',
    value: '$eq',
    predefinedPattern: '{userId}',
  },
  IS_LOGGED_USER_GROUP: {
    label: 'isLoggedInUserGroup',
    value: '$eq',
    predefinedPattern: '{groupId}',
  },
  CONTAINS_LOGGED_USER: {
    label: 'containsLoggedInUser',
    value: '$contains',
    predefinedPattern: ['{userId}'],
  },
  CONTAINS_LOGGED_USER_GROUP: {
    label: 'containsLoggedInUserGroup',
    value: '$contains',
    predefinedPattern: ['{groupId}'],
  },
}

// Filterable types
// Each one must have an "actions" array.
// A "patternComponent" attribute (string) can be added to replace the default pattern component (coming from "getComponentEditorCellForColumnType")
// A "patternComponentOptions" attribute (object) can be added to customize the pattern component
export const COLUMN_FILTERS_CONFIG: Record<
  number,
  {
    actions: FilterAction[]
    patternComponent?: string
    patternComponentOptions?: Record<string, unknown>
  }
> = {
  [COLUMN_TYPE.BOOLEAN]: {
    actions: [ACTIONS.TRUE, ACTIONS.FALSE, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
  },
  [COLUMN_TYPE.STRING]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
      ACTIONS.START_WITH,
      ACTIONS.END_WITH,
    ],
  },
  [COLUMN_TYPE.NUMBER]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.LOWER_THAN,
      ACTIONS.LOWER_EQUAL_THAN,
      ACTIONS.GREATER_THAN,
      ACTIONS.GREATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
  },
  [COLUMN_TYPE.FLOAT]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.LOWER_THAN,
      ACTIONS.LOWER_EQUAL_THAN,
      ACTIONS.GREATER_THAN,
      ACTIONS.GREATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
    patternComponent: 'p-input-number',
    patternComponentOptions: { minFractionDigits: 2 },
  },
  [COLUMN_TYPE.RELATION_BETWEEN_TABLES]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
      ACTIONS.START_WITH,
      ACTIONS.END_WITH,
    ],
    patternComponent: 'p-input-text',
  },
  [COLUMN_TYPE.SINGLE_SELECT]: {
    actions: [ACTIONS.IN, ACTIONS.NOT_IN, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
    patternComponentOptions: {
      optionLabel: 'label',
      optionValue: 'value',
      appendTo: null,
    },
    patternComponent: 'lck-multiselect',
  },
  [COLUMN_TYPE.MULTI_SELECT]: {
    actions: [ACTIONS.ALL, ACTIONS.ANY, ACTIONS.EMPTY, ACTIONS.NOT_EMPTY],
    patternComponentOptions: {
      optionLabel: 'label',
      optionValue: 'value',
      appendTo: null,
    },
  },
  [COLUMN_TYPE.LOOKED_UP_COLUMN]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
      ACTIONS.START_WITH,
      ACTIONS.END_WITH,
    ],
    patternComponent: 'p-input-text',
  },
  [COLUMN_TYPE.DATE]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.EARLIER_THAN,
      ACTIONS.EARLIER_EQUAL_THAN,
      ACTIONS.LATER_THAN,
      ACTIONS.LATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
    patternComponentOptions: {
      // dateFormat: t('date.dateFormatPrime'),
      showTime: false,
    },
  },
  [COLUMN_TYPE.DATETIME]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.EARLIER_THAN,
      ACTIONS.EARLIER_EQUAL_THAN,
      ACTIONS.LATER_THAN,
      ACTIONS.LATER_EQUAL_THAN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY,
    ],
    patternComponent: 'p-calendar',
    patternComponentOptions: {
      // dateFormat: t('date.dateFormatPrime'),
      showTime: true,
    },
  },
  [COLUMN_TYPE.USER]: {
    actions: [ACTIONS.IS_LOGGED_USER],
  },
  [COLUMN_TYPE.GROUP]: {
    actions: [ACTIONS.IS_LOGGED_USER_GROUP],
  },
  [COLUMN_TYPE.MULTI_USER]: {
    actions: [ACTIONS.CONTAINS_LOGGED_USER],
  },
  [COLUMN_TYPE.MULTI_GROUP]: {
    actions: [ACTIONS.CONTAINS_LOGGED_USER_GROUP],
  },
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
                  return `[data][${column.slug}.value]`
                case COLUMN_TYPE.LOOKED_UP_COLUMN:
                  switch (originalType) {
                    case COLUMN_TYPE.GROUP:
                    case COLUMN_TYPE.USER:
                    case COLUMN_TYPE.MULTI_USER:
                      return `[data][${column.slug}.reference]`
                    default:
                      return `[data][${column.slug}.value]`
                  }
                case COLUMN_TYPE.USER:
                case COLUMN_TYPE.GROUP:
                case COLUMN_TYPE.MULTI_USER:
                case COLUMN_TYPE.MULTI_GROUP:
                  return `[data][${column.slug}.reference]`
                default:
                  return `[data][${column.slug}]`
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
        column: filter.column.slug,
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
