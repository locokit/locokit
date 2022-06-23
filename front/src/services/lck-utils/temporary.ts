import { COLUMN_TYPE } from '@locokit/lck-glossary'
// Todo: To refacto in glossary

export function transformColumnsType (): Record<string, number> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return Object.entries(COLUMN_TYPE).reduce((acc: Record<string, any>, elem: Record<string, any>) => {
    if (!isNaN(elem[0])) {
      acc[elem[1]] = elem[0]
    }
    return acc
  }, {})
}
