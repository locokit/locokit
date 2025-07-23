type PlaceholderValue = {
  key: string
  value: string | number | boolean
}

export type Filter = {
  [key: string]: string | Filter
}

/**
 * Recursive function to replace placeholder
 * in a policy filter (create, read, patch)
 *
 * @return the filter with all palceholder replaced
 */
export function replacePlaceholder(filter: Filter, placeholders: PlaceholderValue[]): Filter {
  const finalFilter: Filter = {}
  if (!filter) return finalFilter
  /**
   * for each key of the filter,
   * if the value is an object, we call again the same function,
   * if the value is a string, we try to search & replace all placeholders
   */
  Object.keys(filter).forEach((currentFilterKey) => {
    const value = filter[currentFilterKey]
    switch (typeof value) {
      case 'object':
        finalFilter[currentFilterKey] = replacePlaceholder(value, placeholders)
        break
      case 'string':
        finalFilter[currentFilterKey] = placeholders.reduce((acc, currentPlaceholder) => {
          return acc.replace(`{${currentPlaceholder.key}}`, currentPlaceholder.value as string)
        }, value)
    }
  })

  return finalFilter
}
