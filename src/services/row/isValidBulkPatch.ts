import { HookContext } from '@feathersjs/feathers'

/**
 * Is the context request a valid bulk patch request ?
 *
 * @param {HookContext} context
 * @returns {boolean} true if the request can be used to patch multiple rows, else false.
 */
export const isValidBulkPatch = () => (
  context: HookContext,
): boolean => {
  return (
    context.id === null && !context.params.provider && context.params.query?.table_id
  )
}
