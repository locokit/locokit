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

export default {
  zipArrays,
  getArrayDepth
}
