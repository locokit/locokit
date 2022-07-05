import { COLUMN_TYPE } from '@locokit/lck-glossary'
// Todo: To refacto in glossary

/**
 * Transform COLUMN_TYPE's enum in record
 * Avoid key and value inversion and multiplication of data when we use directly this enum
 */
export function transformColumnsType (): Record<string, string> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return Object.entries(COLUMN_TYPE).reduce((acc: Record<string, any>, elem: Record<string, any>) => {
    if (!isNaN(elem[0])) {
      acc[elem[1]] = elem[0]
    }
    return acc
  }, {})
}
