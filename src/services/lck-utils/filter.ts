/* eslint-disable @typescript-eslint/no-non-null-assertion */
import i18n from '@/plugins/i18n'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { LckTableViewColumn, LckTableViewFilter, LckTableViewFilterValue } from '../lck-api/definitions'
import { getColumnTypeId } from './columns'
import { formatDateISO, getDateFromString } from './date'

// Interfaces
export interface Filter {
  operator: string;
  column: null | {
    label: string;
    value: string;
    originalType: COLUMN_TYPE;
    type: COLUMN_TYPE;
    dropdownOptions?: object;
  };
  action: FilterAction | null;
  pattern: number | boolean | string | Date | null;
}

export interface FilterAction {
  label: string;
  value: string;
  predefinedPattern?: string | number | boolean;
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
  },
  NOT_MATCH: {
    label: 'doesNotMatch',
    value: '$notILike',
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
      ],
      patternComponent: 'p-input-text',
    },
    [COLUMN_TYPE.DATE]: {
      actions: [
        ACTIONS.EQUAL,
        ACTIONS.NOT_EQUAL,
        { ...ACTIONS.LOWER_THAN, label: 'isEarlierThan' },
        { ...ACTIONS.LOWER_EQUAL_THAN, label: 'isEarlierThanOrEqualTo' },
        { ...ACTIONS.GREATER_THAN, label: 'isLaterThan' },
        { ...ACTIONS.GREATER_EQUAL_THAN, label: 'isLaterThanOrEqualTo' },
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
        { ...ACTIONS.LOWER_THAN, label: 'isEarlierThan' },
        { ...ACTIONS.LOWER_EQUAL_THAN, label: 'isEarlierThanOrEqualTo' },
        { ...ACTIONS.GREATER_THAN, label: 'isLaterThan' },
        { ...ACTIONS.GREATER_EQUAL_THAN, label: 'isLaterThanOrEqualTo' },
        ACTIONS.EMPTY,
        ACTIONS.NOT_EMPTY,
      ],
      patternComponent: 'p-calendar',
      patternComponentOptions: {
        dateFormat: i18n.t('date.dateFormatPrime'),
        showTime: true,
      },
    },
  }

/**
 * Get the formatted pattern from a filter
 * @param filter The filter
 * @returns The pattern of the filter that can be used in FeathersJS queries
 */
function getFormattedPattern (filter: Filter) {
  switch (filter.column!.originalType) {
    case COLUMN_TYPE.DATE:
      if (filter.pattern instanceof Date) {
        try {
          return formatDateISO(filter.pattern)
        } catch (RangeError) {}
      }
  }
  return filter.action && ['$ilike', '$notILike'].includes(filter.action.value)
    ? `%${filter.pattern}%`
    : (filter.pattern as number | boolean | string | null)
}

/**
 * Convert filters used in the FilterButton component to FeathersJS filters
 * @param filters The filters specified in the FilterButton component
 * @returns The corresponding FeathersJS filters
 */
export function getCurrentFilters (filters: Filter[]) {
  const formattedFilters: Record<string, number | boolean | string | null> = {}
  filters
    .filter(filter => ![filter.column, filter.action, filter.pattern].includes(null))
    .forEach((filter, index) => {
      formattedFilters[
      // Operator
      `${filter.operator}[${index}]` +
      // Field
      (columnType => {
        switch (columnType) {
          case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
          case COLUMN_TYPE.LOOKED_UP_COLUMN:
            return `[data][${filter.column!.value}.value]`
          default:
            return `[data][${filter.column!.value}]`
        }
      })(filter.column!.type) +
      // Action and the corresponding pattern
      `[${filter.action!.value}]`] = getFormattedPattern(filter)
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
        dbPattern: getFormattedPattern(filter)!,
        pattern: filter.pattern instanceof Date ? formatDateISO(filter.pattern) : filter.pattern,
      })
    }
  })
  return {
    operator: filters[0].operator,
    values: tableViewFilterToSave,
  }
}

/**
 * Convert the filters retrieved from the API a another format that can be used in the FilterButton component
 * @param filter The filters retrieved from the API
 * @returns The corresponding filters that can be used in the FilterButton component
 */
export function convertFiltersFromDatabase ({ columns, filter }: {
  columns: LckTableViewColumn[];
  filter: LckTableViewFilter | null;
}): Filter[] {
  // Filters that we can use in the FilterButton component and as input of the getCurrentFilters method
  const allFilters: Filter[] = []
  if (filter && columns.length > 0) {
    // Loop on saved in database filters
    filter.values.forEach(({ column, action, pattern }) => {
      // Get the column used in the current filter
      const tableViewColumn = columns.find(c => c.id === column)

      if (tableViewColumn) {
        const columnType = getColumnTypeId(tableViewColumn)
        // Get the action used in the current filter
        let originalAction = COLUMN_FILTERS_CONFIG[columnType]?.actions.find(a => a.label === action)

        // A looked-up column has specific filters if the original type is not supported
        if (!originalAction && tableViewColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
          originalAction = COLUMN_FILTERS_CONFIG[COLUMN_TYPE.LOOKED_UP_COLUMN].actions.find(a => a.label === action)
        }

        if (originalAction) {
          // Get the pattern used in the current filter
          const originalPattern = originalAction.predefinedPattern !== undefined
            ? originalAction.predefinedPattern
            : columnType === COLUMN_TYPE.DATE ? getDateFromString(pattern) : pattern

          // Add the filter
          allFilters.push({
            operator: filter.operator,
            column: {
              label: tableViewColumn.text,
              originalType: columnType,
              type: tableViewColumn.column_type_id,
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
