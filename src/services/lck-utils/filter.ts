import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { formatISO } from 'date-fns'

export function getCurrentFilters (filters: {operator: string; column: {dropdownOptions: string; label: string; type: number; originalType: number; value: string}|null; action: { label: string; value: string}; pattern: string|Date}[]) {
  const formattedFilters: Record<string, string|Date> = {}
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
            return `[data][${filter?.column?.value}.value]`
          default:
            return `[data][${filter?.column?.value}]`
        }
      })(filter?.column?.type) +
      // Action
      `[${filter.action.value}]`] =
        (columnType => {
          switch (columnType) {
            case COLUMN_TYPE.DATE:
              if (filter.pattern instanceof Date) {
                try {
                  return formatISO(filter.pattern, { representation: 'date' })
                } catch (RangeError) {}
              }
          }
          return ['$ilike', '$notILike'].includes(filter.action.value) ? `%${filter.pattern}%` : filter.pattern
        })(filter?.column?.originalType)
    })
  return formattedFilters
}
