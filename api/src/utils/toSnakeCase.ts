/**
 * Convert a string in simple chars with underscore
 * See https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
 *
 * AND
 *
 * https://stackoverflow.com/questions/52963900/convert-different-strings-to-snake-case-in-javascript/69878219#69878219
 *
 * for better understanding
 */
export function toSnakeCase(text: string): string {
  return text
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
