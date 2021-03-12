import { HookContext } from '@feathersjs/feathers'

/**
 * Is the context request a valid bulk request ?
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export const isValidBulkPatch = () => (
  context: Partial<HookContext>
): boolean => {
  return (
    context.id === null &&
    Object.keys(context.params?.query || {}).includes('table_id')
  )
}
