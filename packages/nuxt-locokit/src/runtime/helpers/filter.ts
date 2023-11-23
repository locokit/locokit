import { FIELD_TYPE } from '@locokit/definitions'
import { Filter, FilterAction, inputPatternType } from '../interfaces/toMigrate'
import { formatDateISO, formatDateTimeISO } from './date'

// Not all v0.7 functions have been migrated, as we are not yet sure whether they are needed.

/**
 * Convert the pattern used in the FilterButton component to a pattern that can be used in FeathersJS or saved into the database.
 * pattern = The filters specified in the FilterButton component
 */
export function getFormattedPattern(
  motif: inputPatternType,
  columnType: string,
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
    if (columnType === FIELD_TYPE.DATE) {
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
            `[${column.field}]` +
            // Action
            `[${action.featherKey}]`
        ] = getFormattedPattern(motif, column.type, action, wildCards)
      }
    })
  }
  return formattedFilters
}
