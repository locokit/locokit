/**
 * Add the content of one set into another one.
 * @param setToUpdate The set in which the data will be added.
 * @param setToAdd The set to add to the other one.
 */
export function mergeSets (setToUpdate: Set<any>, setToAdd: Set<any>): void {
  for (const item of setToAdd) {
    setToUpdate.add(item)
  }
}

/**
 * Return an object containing a subset of properties of another object
 * @param originalObject the original object
 * @param properties the properties of the original object to keep
 * @returns an object containing a subset of properties
 */
export function getSubObject (originalObject: Record<string, any>, properties: string[]): Record<string, any> {
  return properties.reduce((subObject: Record<string, any>, property: string) => {
    if (Object.prototype.hasOwnProperty.call(originalObject, property)) {
      subObject[property] = originalObject[property]
    }
    return subObject
  }, {})
}
