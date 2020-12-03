import { formatISO, lightFormat, parseISO } from 'date-fns'
import { TranslateResult } from 'vue-i18n'

export function formatDate (date: string, format: TranslateResult) {
  return lightFormat(parseISO(date), `${format}`)
}

export function formatDateISO (date: Date) {
  return formatISO(date, { representation: 'date' })
}
