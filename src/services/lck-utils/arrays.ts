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

export default {
  zipArrays
}
