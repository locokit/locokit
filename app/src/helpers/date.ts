import { formatISO, parseISO } from 'date-fns'

// Todo: To be tested with filters

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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
  return null
}
