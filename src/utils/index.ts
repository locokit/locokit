export function mergeSets (setToUpdate: Set<any>, setToAdd: Set<any>): void {
  for (const item of setToAdd) {
    setToUpdate.add(item)
  }
}
