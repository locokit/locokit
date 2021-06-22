import { mergeSets, setsAreEqual } from './set'

describe('Set utilities', () => {
  describe('mergeSets', () => {
    it('Return the merging of the two sets and update the destination one', () => {
      const setToAdd = new Set([1, 2])
      const destinationSet = new Set([2, 3])
      const returnedSet = mergeSets(setToAdd, destinationSet)
      expect(returnedSet).toBe(destinationSet)
      expect(destinationSet.size).toBe(3)
      expect(returnedSet.has(1)).toBe(true)
      expect(returnedSet.has(2)).toBe(true)
      expect(returnedSet.has(3)).toBe(true)
    })
    it('Return the merging of two sets if the set to add is empty', () => {
      const setToAdd = new Set([])
      const destinationSet = new Set([2, 3])
      const returnedSet = mergeSets(setToAdd, destinationSet)
      expect(returnedSet.size).toBe(2)
      expect(returnedSet.has(2)).toBe(true)
      expect(returnedSet.has(3)).toBe(true)
    })
    it('Return the merging of two sets if the destination set is empty', () => {
      const setToAdd = new Set([1, 2])
      const destinationSet = new Set()
      const returnedSet = mergeSets(setToAdd, destinationSet)
      expect(returnedSet.size).toBe(2)
      expect(returnedSet.has(1)).toBe(true)
      expect(returnedSet.has(2)).toBe(true)
    })
  })
  describe('setAreEqual', () => {
    it('Returns false if the two sets have not the same size', () => {
      expect(
        setsAreEqual(
          new Set([1]),
          new Set([2, 3])
        )
      ).toBe(false)
    })
    it('Returns false if the two sets have not the same values but have some common ones', () => {
      expect(
        setsAreEqual(
          new Set([1, 4, 5]),
          new Set([1, 2, 3])
        )
      ).toBe(false)
    })
    it('Returns false if the two sets have not some common values', () => {
      expect(
        setsAreEqual(
          new Set([1, 2]),
          new Set([3, 4])
        )
      ).toBe(false)
    })
    it('Returns true if the two sets contain the same values', () => {
      expect(
        setsAreEqual(
          new Set([3, 2, 1]),
          new Set([1, 3, 2])
        )
      ).toBe(true)
    })
  })
})
