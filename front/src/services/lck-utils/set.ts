export const setsAreEqual = (set1: Set<unknown>, set2: Set<unknown>) => {
  // Returns true if the two sets are equal, otherwise returns false
  if (set1.size !== set2.size) return false
  for (const elt of set1) if (!set2.has(elt)) return false
  return true
}

export const mergeSets = (setToAdd: Set<unknown>, destinationSet: Set<unknown>): Set<unknown> => {
  // Merge one set into another one
  setToAdd.forEach(destinationSet.add, destinationSet)
  return destinationSet
}

export const setHasValues = (set: Set<unknown>, values: unknown[]) => {
  // Check that a set contains several values
  for (const value of values) {
    if (set.has(value)) return true
  }
  return false
}

export default {
  setsAreEqual,
  mergeSets,
  setHasValues,
}
