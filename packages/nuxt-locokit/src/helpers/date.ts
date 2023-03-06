import { formatISO, lightFormat, parseISO } from 'date-fns'
import { TranslateResult } from 'vue-i18n'

export function formatDateString(date: string, format: TranslateResult) {
  try {
    return lightFormat(parseISO(date), `${format}`)
  } catch {
    return 'no date'
  }
}

export function formatDate(date: Date, format: TranslateResult) {
  return lightFormat(date, `${format}`)
}

export function formatDateISO(date: Date) {
  return formatISO(date, { representation: 'date' })
}

export function formatDateTimeISO(date: Date) {
  return formatISO(date, { representation: 'complete' })
}

export function getDateFromISOString(date: unknown) {
  try {
    if (typeof date === 'string') {
      return parseISO(date)
    }
  } catch (RangeError) {}
  return null
}
