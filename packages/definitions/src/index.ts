export * from './diff'
export * from './diff/typebox'
export {
  FIELD_COMPONENT,
  FIELD_TYPE,
  convertDBTypeToFieldType,
  type DB_DIALECT,
  type DB_TYPE,
  type LocoKitFormField,
  type LocoKitFormFieldRule,
} from './fieldType'
export { COLOR_SCHEME, TAILWIND_COLORS } from './helpers/color'
export { SERVICES } from './services'

export const USER_PROFILE = Object.freeze({
  MEMBER: 'MEMBER',
  CREATOR: 'CREATOR',
  ADMIN: 'ADMIN',
})

export type LocoKitMessage = {
  status: 'contrast'|'error'|'info'|'secondary'|'success'|'warn'
  text: string
}

/**
 * Convert a string in the "snake_case" format.
 *
 * Operations performed on the given string:
 * - removal of diacritics,
 * - separation of words of any potential substring formatted in "camelCase",
 *   "PascalCase" and other variants using uppercase characters,
 * - conversion of uppercase characters in lowercase,
 * - replacement of spaces and special characters series by single underscores.
 *
 * See the following discussions for a better understanding:
 * - https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
 * - https://stackoverflow.com/questions/52963900/convert-different-strings-to-snake-case-in-javascript/69878219#69878219
 */
export function toSnakeCase(str: string | null): string {
  if (!str) return ''

  return str
    .normalize('NFD') // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    .replace(/[\u0300-\u036f]/g, '') // remove all diacritics
    .replace(/([a-z])([A-Z]+)/g, (_, s1: string, s2: string) => `${s1} ${s2}`)
    .replace(
      /([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/,
      (_, s1: string, s2: string, s3: string) => s1 + s2.toLowerCase() + s3,
    )
    .replace(/([A-Z]+)([A-Z][a-z])/g, (_, s1: string, s2: string) => s1.toLowerCase() + ' ' + s2)
    .replace(/([A-Z])([A-Z]+)/g, (_, s1: string, s2: string) => `${s1}${s2.toLowerCase()}`)
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('_')
}
