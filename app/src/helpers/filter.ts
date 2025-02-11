import { FIELD_TYPE } from '@locokit/definitions'
import type { Filter, FilterRule, FilterValue } from '@locokit/vue-components'
import { formatDateISO, formatDateTimeISO } from './date'

// Not all v0.7 functions have been migrated, as we are not yet sure whether they are needed.

/**
 * Convert the pattern used in the FilterButton component to a pattern that can be used in FeathersJS or saved into the database.
 * pattern = The filters specified in the FilterButton component
 */
export function getFormattedValue(
  value: FilterValue,
  columnType: string,
  rule: FilterRule,
  wildCards: Record<string, string | number> = {},
): boolean | number | string | Array<string | number> {
  if (typeof value === 'string') {
    // Replace the specific keys containing in the string pattern by the corresponding values
    return (
      wildCards[value] ||
      (rule.valuePrefix ?? '') + value + (rule.valueSuffix ?? '')
    )
  } else if (Array.isArray(value)) {
    // Replace the specific keys containing in the items of the pattern by the corresponding values
    return value.map((item) => wildCards[item] || item)
  } else if (value instanceof Date) {
    if (columnType === FIELD_TYPE.DATE) {
      // Get the iso string representation of the date
      return formatDateISO(value)
    } else {
      // Get the iso string representation of the datetime
      return formatDateTimeISO(value)
    }
  } else {
    return value as boolean | number | string | Array<string | number>
  }
}

/**
 * Convert filters used in the FilterButton component to FeathersJS filters
 */
export function getCurrentFilters(
  filters: Filter[],
  wildCards: Record<string, string | number> = {},
) {
  const formattedFilters: Record<string, FilterValue> = {}
  const cleanedFilters = filters.filter(
    (filter) => ![filter.field, filter.rule, filter.value].includes(null),
  )
  if (cleanedFilters.length > 0) {
    cleanedFilters.forEach(({ field, rule, value, logicalOperator }, index) => {
      if (field && rule) {
        formattedFilters[
          // Operator
          `${logicalOperator}[${index}]` +
          // Field
          `[${field.slug}]` +
          // Action
          `[${rule.operator}]`
        ] = getFormattedValue(value, field.type, rule, wildCards)
      }
    })
  }
  return formattedFilters
}
