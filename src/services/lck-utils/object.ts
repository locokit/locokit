export function objectIsEmpty (object: object) {
  for (const key in object) { return false }
  return true
}
