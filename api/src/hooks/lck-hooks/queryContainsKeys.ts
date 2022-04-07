import { HookContext } from '@feathersjs/feathers'

/**
 * Is the context's query param containing ANY or ALL the keys ?
 */
export const queryContainsKeys = (
  keysToCheck: string[],
  mode: 'ALL' | 'ANY' = 'ANY',
) => (
  context: Partial<HookContext>,
): boolean => {
  const paramsQueryKeys = Object.keys(context.params?.query || {})
  /**
   * We init the result depending on the mode.
   * If mode is ALL, all keys must be in the query params.
   * so, we need to start with 'true' for the first result value.
   * If mode is ANY, any of the keys have to be in the query params.
   * so, we need to set it to 'false'.
   */
  let result = (mode === 'ALL')
  keysToCheck.forEach(key => {
    const isIncluded = paramsQueryKeys.includes(key)
    const isDefined = (context.params?.query?.[key] !== null && context.params?.query?.[key] !== undefined)
    if (mode === 'ALL') {
      result = result && (isIncluded && isDefined)
    } else if (mode === 'ANY') {
      result = result || (isIncluded && isDefined)
    }
  })
  return result
}
