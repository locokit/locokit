/**
 * Return an array that aggregates elements from each of the two input arrays.
 */
export const zipArrays = (firstArray: [], secondArray: [], firstKey: string, secondKey: string) => {
  const zippedArray: object[] = []
  if (Array.isArray(firstArray) && Array.isArray(secondArray)) {
    const maxLength = Math.max(firstArray.length, secondArray.length)
    for (let index = 0; index < maxLength; index++) {
      zippedArray.push({
        [firstKey]: firstArray[index],
        [secondKey]: secondArray[index]
      })
    }
  }
  return zippedArray
}

/**
 * Get dimension of an array
 * @param value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getArrayDepth = (value: any): number => {
  return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0
}

/**
 * Convert an array of objects in an object whose the key is the value of one string property of the object
 * and the value is the related object. If the property is not unique, only the last value is kept.
 */
export function objectFromArray<T extends object> (array: T[], idKey: keyof T): Record<string, T> {
  return array.reduce<Record<string, T>>(
    (allElements, elementToAdd) => {
      const keyValue = elementToAdd[idKey]
      if (typeof keyValue === 'string') {
        Object.assign(allElements, { [keyValue]: elementToAdd })
      }
      return allElements
    }
    , {}
  )
}

export default {
  zipArrays,
  getArrayDepth,
  objectFromArray
}
