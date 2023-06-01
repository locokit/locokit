/**
 * Convert a string in regexp used for feathers-objection
 * $joinRelated / $joinEager / $eager
 *
 * Actually, if we give a $1|$2|$3 string, we should have a regexp like this :
 * /$1|$2|$3|[$1,$2]|[$2,$3]|[$1,$3]|[$1,$2,$3]/
 */
export function toEagerRegExp(tableRelationsNames: string): RegExp {
  return new RegExp(
    `^(${tableRelationsNames})|\\[(${tableRelationsNames})(,(${tableRelationsNames})(?!.*\\2))*\\]$`,
  )
}
