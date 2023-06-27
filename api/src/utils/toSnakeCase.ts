/**
 * Convert a string in simple chars with underscore
 * See https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
 * for better understanding
 */
export function toSnakeCase(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD') // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      .replace(/[\u0300-\u036f]/g, '') // remove all diacritics
      /* eslint-disable no-useless-escape */
      .replace(/[[ ,\-'"\.\]()/]/g, '_')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/_$/, '')
      .replace(/^_/, '')
  )
}
