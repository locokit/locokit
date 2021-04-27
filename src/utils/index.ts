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
