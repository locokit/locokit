import {
  getSubObject,
  mergeSets,
} from '.'

function compareNumbers (a: number, b: number): number {
  return a - b
}

describe('utility functions', () => {
  describe('getSubObject', () => {
    it('return the desired properties of an object is some are unknown', () => {
      const object = {
        a: 0,
        b: 1,
        c: 2,
      }
      expect(getSubObject(object, ['a', 'd'])).toStrictEqual({
        a: 0,
      })
    })
    it('return an empty object if no property is specified', () => {
      const object = {
        a: 0,
        b: 1,
        c: 2,
      }
      expect(getSubObject(object, [])).toStrictEqual({})
    })
    it('return an empty object if the original one is empty', () => {
      const object = {}
      expect(getSubObject(object, ['a', 'd'])).toStrictEqual({})
    })
  })
  describe('mergeSets', () => {
    it('add the content of one set into another one if the sets are not empty and have common values', () => {
      expect.assertions(1)
      const setToUpdate: Set<number> = new Set([1, 2, 3, 4, 5])
      const setToAdd: Set<number> = new Set([4, 5, 6, 7])
      mergeSets(setToUpdate, setToAdd)
      expect([...setToUpdate].sort(compareNumbers)).toEqual([1, 2, 3, 4, 5, 6, 7])
    })
    it('add the content of one set into another one if the sets are not empty and do not have common values', () => {
      expect.assertions(1)
      const setToUpdate: Set<number> = new Set([1, 2, 3])
      const setToAdd: Set<number> = new Set([4, 5, 6, 7])
      mergeSets(setToUpdate, setToAdd)
      expect([...setToUpdate].sort(compareNumbers)).toEqual([1, 2, 3, 4, 5, 6, 7])
    })
    it('add the content of one set into another empty one', () => {
      expect.assertions(1)
      const setToUpdate: Set<number> = new Set()
      const setToAdd: Set<number> = new Set([4, 5, 6, 7])
      mergeSets(setToUpdate, setToAdd)
      expect([...setToUpdate].sort(compareNumbers)).toEqual([4, 5, 6, 7])
    })
    it('add the content of one empty set into another one', () => {
      expect.assertions(1)
      const setToUpdate: Set<number> = new Set([1, 2, 3])
      const setToAdd: Set<number> = new Set()
      mergeSets(setToUpdate, setToAdd)
      expect([...setToUpdate].sort(compareNumbers)).toEqual([1, 2, 3])
    })
    it('do nothing if the two sets are empty', () => {
      expect.assertions(1)
      const setToUpdate: Set<number> = new Set()
      const setToAdd: Set<number> = new Set()
      mergeSets(setToUpdate, setToAdd)
      expect(setToUpdate.size).toBe(0)
    })
  })
})
