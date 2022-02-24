/* eslint-disable @typescript-eslint/no-non-null-assertion */
import i18n from '@/plugins/i18n'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { LckTableColumn, LckTableViewFilter, LckTableViewFilterPattern, LckTableViewFilterValue } from '../lck-api/definitions'
import { getColumnTypeId } from './columns'
import { formatDateISO, formatDateTimeISO, getDateFromISOString } from './date'

// Interfaces
type inputPatternType = LckTableViewFilterPattern | Date | null

export interface Filter {
  operator: string;
  column: null | {
    label: string;
    value: string;
    originalType: COLUMN_TYPE;
    type: COLUMN_TYPE;
  };
  action: FilterAction | null;
  pattern: inputPatternType;
}

export interface FilterAction {
  label: string;
  value: string;
  predefinedPattern?: string | number | boolean | string[];
  patternPrefix?: string;
  patternSuffix?: string;
}

// Available operators
export const OPERATORS = [{
  label: 'or',
  value: '$or',
}, {
  label: 'and',
  value: '$and',
}]

// Available actions
// Each one must have a "label" used for translation and a "value" corresponding to the FeatherJS Query Operators.
// The "predefinedPattern" attribute is used to give a value to an implicit pattern.
export const ACTIONS: Record<string, FilterAction> = {
  MATCH: {
    label: 'match',
    value: '$ilike',
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
}

// Filterable types
// Each one must have an "actions" array.
// A "patternComponent" attribute (string) can be added to replace the default pattern component (coming from "getComponentEditorCellForColumnType")
// A "patternComponentOptions" attribute (object) can be added to customize the pattern component
export const COLUMN_FILTERS_CONFIG: Record<number, {
  actions: FilterAction[];
  patternComponent?: string;
  patternComponentOptions?: Record<string, unknown>;
  }> = {
    [COLUMN_TYPE.BOOLEAN]: {
      actions: [
        ACTIONS.TRUE,
        ACTIONS.FALSE,
        ACTIONS.EMPTY,
        ACTIONS.NOT_EMPTY,
      ],
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
      actions: [
        ACTIONS.IN,
        ACTIONS.NOT_IN,
        ACTIONS.EMPTY,
        ACTIONS.NOT_EMPTY,
      ],
      patternComponentOptions: {
        optionLabel: 'label',
        optionValue: 'value',
        appendTo: null,
      },
      patternComponent: 'lck-multiselect',
    },
    [COLUMN_TYPE.MULTI_SELECT]: {
      actions: [
        ACTIONS.ALL,
        ACTIONS.ANY,
        ACTIONS.EMPTY,
        ACTIONS.NOT_EMPTY,
      ],
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
        dateFormat: i18n.t('date.dateFormatPrime'),
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
        dateFormat: i18n.t('date.dateFormatPrime'),
        showTime: true,
      },
    },
    [COLUMN_TYPE.USER]: {
      actions: [
        ACTIONS.IS_LOGGED_USER,
      ],
    },
    [COLUMN_TYPE.GROUP]: {
      actions: [
        ACTIONS.IS_LOGGED_USER_GROUP,
      ],
    },
    [COLUMN_TYPE.MULTI_USER]: {
      actions: [
        ACTIONS.CONTAINS_LOGGED_USER,
      ],
    },
  }

/**
 * Convert the pattern used in the FilterButton component to a pattern that can be used in FeathersJS or saved into the database.
 * @param pattern The filters specified in the FilterButton component
 * @returns The formatted pattern
 */
export function getFormattedPattern (pattern: inputPatternType, columnType: COLUMN_TYPE, action: FilterAction, wildCards: Record<string, string | number> = {}): LckTableViewFilterPattern {
  if (typeof pattern === 'string') {
    // Replace the specific keys containing in the string pattern by the corresponding values
    return wildCards[pattern] || ((action.patternPrefix || '') + pattern + (action.patternSuffix || ''))
  } else if (Array.isArray(pattern)) {
    // Replace the specific keys containing in the items of the pattern by the corresponding values
    return pattern.map(item => wildCards[item] || item)
  } else if (pattern instanceof Date) {
    if (columnType === COLUMN_TYPE.DATE) {
      // Get the iso string representation of the date
      return formatDateISO(pattern)
    } else {
      // Get the iso string representation of the datetime
      return formatDateTimeISO(pattern)
    }
  } else {
    // Just return the pattern
    return pattern as LckTableViewFilterPattern
  }
}

/**
 * Convert the pattern retrieved from the API into another format that can be used in the FilterButton component
 * @param pattern The pattern retrieved from the API
 * @returns The corresponding pattern that can be used in the FilterButton component
 */
export function getPatternFromDatabase (pattern: LckTableViewFilterPattern, action: FilterAction, columnType: COLUMN_TYPE) {
  if (action.predefinedPattern !== undefined) {
    // Predefined pattern
    return action.predefinedPattern
  } else if ([COLUMN_TYPE.DATE, COLUMN_TYPE.DATETIME].includes(columnType)) {
    // Date pattern defined by the user
    return getDateFromISOString(pattern) || pattern
  } else if (typeof pattern === 'string') {
    // Remove the prefix and the suffix for a string pattern defined by the user
    const fromIndex = action.patternPrefix ? action.patternPrefix.length : 0
    const toIndex = action.patternSuffix?.length ? -action.patternSuffix.length : undefined
    return pattern.slice(fromIndex, toIndex)
  } else {
    // Just return the pattern defined by the user
    return pattern
  }
}

/**
 * Convert filters used in the FilterButton component to FeathersJS filters
 * @param filters The filters specified in the FilterButton component
 * @returns The corresponding FeathersJS filters
 */
export function getCurrentFilters (filters: Filter[], wildCards: Record<string, string | number> = {}) {
  const formattedFilters: Record<string, LckTableViewFilterPattern | null> = {}
  filters
    .filter(filter => ![filter.column, filter.action, filter.pattern].includes(null))
    .forEach((filter, index) => {
      formattedFilters[
      // Operator
      `${filter.operator}[${index}]` +
      // Field
      ((columnType, originalType) => {
        switch (columnType) {
          case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
            return `[data][${filter.column!.value}.value]`
          case COLUMN_TYPE.LOOKED_UP_COLUMN:
            switch (originalType) {
              case COLUMN_TYPE.GROUP:
              case COLUMN_TYPE.USER:
              case COLUMN_TYPE.MULTI_USER:
                return `[data][${filter.column!.value}.reference]`
              default:
                return `[data][${filter.column!.value}.value]`
            }
          case COLUMN_TYPE.USER:
          case COLUMN_TYPE.GROUP:
          case COLUMN_TYPE.MULTI_USER:
            return `[data][${filter.column!.value}.reference]`
          default:
            return `[data][${filter.column!.value}]`
        }
      })(filter.column!.type, filter.column!.originalType) +
      // Action
      `[${filter.action!.value}]`] = getFormattedPattern(
        filter.pattern,
        filter.column!.originalType,
        filter.action!,
        wildCards,
      )
    })
  return formattedFilters
}

/**
 * Convert the filters used in the FilterButton component into a lighter format that will be returned to the API
 * @param filters The filters specified in the FilterButton component
 * @returns The corresponding filters that will be returned to the API
 */
export function convertFiltersToDatatabase (filters: Filter[]): LckTableViewFilter | null {
  if (filters.length === 0) return null
  const tableViewFilterToSave: LckTableViewFilterValue[] = []
  filters.forEach(filter => {
    if (filter.action != null && filter.column != null && filter.pattern != null) {
      tableViewFilterToSave.push({
        action: filter.action.label,
        column: filter.column.value,
        dbAction: filter.action.value,
        pattern: getFormattedPattern(filter.pattern, filter.column.originalType, filter.action),
      })
    }
  })
  return {
    operator: filters[0].operator,
    values: tableViewFilterToSave,
  }
}

/**
 * Convert the filters retrieved from the API into another format that can be used in the FilterButton component
 * @param filter The filters retrieved from the API
 * @returns The corresponding filters that can be used in the FilterButton component
 */
export function convertFiltersFromDatabase ({ columns, filter }: {
  columns: LckTableColumn[];
  filter: LckTableViewFilter | null;
}): Filter[] {
  // Filters that we can use in the FilterButton component and as input of the getCurrentFilters method
  const allFilters: Filter[] = []
  if (filter && columns.length > 0) {
    // Loop on saved in database filters
    filter.values.forEach(({ column, action, pattern }) => {
      // Get the column used in the current filter
      const tableColumn = columns.find(c => c.id === column)

      if (tableColumn) {
        const columnType = getColumnTypeId(tableColumn)
        // Get the action used in the current filter
        let originalAction = COLUMN_FILTERS_CONFIG[columnType]?.actions.find(a => a.label === action)

        // A looked-up column has specific filters if the original type is not supported
        if (!originalAction && tableColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
          originalAction = COLUMN_FILTERS_CONFIG[COLUMN_TYPE.LOOKED_UP_COLUMN].actions.find(a => a.label === action)
        }

        if (originalAction) {
          // Get the pattern used in the current filter
          const originalPattern = getPatternFromDatabase(pattern, originalAction, columnType)

          // Add the filter
          allFilters.push({
            operator: filter.operator,
            column: {
              label: tableColumn.text,
              originalType: columnType,
              type: tableColumn.column_type_id,
              value: column,
            },
            action: originalAction,
            pattern: originalPattern,
          })
        }
      }
    })
  }
  return allFilters
}
