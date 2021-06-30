import { formatISO, lightFormat, parseISO } from 'date-fns'
import { TranslateResult } from 'vue-i18n'

export function formatDateString (date: string, format: TranslateResult) {
  return lightFormat(parseISO(date), `${format}`)
}

export function formatDate (date: Date, format: TranslateResult) {
  return lightFormat(date, `${format}`)
}

export function formatDateISO (date: Date) {
  return formatISO(date, { representation: 'date' })
}

export function formatDateTimeISO (date: Date) {
  return formatISO(date, { representation: 'complete' })
}
