export const setsAreEqual = (set1: Set<unknown>, set2: Set<unknown>) => {
  if (set1.size !== set2.size) return false
  for (const elt of set1) if (!set2.has(elt)) return false
  return true
}

export default {
  setsAreEqual
}
