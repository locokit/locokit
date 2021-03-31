import { HookContext } from '@feathersjs/feathers'

/**
 * Is the request a bulk patch request ?
 *
 * @param {HookContext} context
 * @returns {boolean} true if the context id is specified, else false.
 */
export const isBulkPatch = () => (
  context: HookContext,
): boolean => {
  return (
    context.id === null
  )
}

/**
 * Is the request a valid internal bulk patch request ?
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
