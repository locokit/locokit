import { formatISO, lightFormat, parseISO } from 'date-fns'
import { TranslateResult } from 'vue-i18n'

export function formatDate (date: Date, format: TranslateResult) {
  return lightFormat(date, `${format}`)
}

export function formatDateISO (date: Date) {
  return formatISO(date, { representation: 'date' })
}

export function formatDateTimeISO (date: Date) {
  return formatISO(date, { representation: 'complete' })
}
