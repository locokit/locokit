import { HookContext } from '@feathersjs/feathers';

/**
 * Is the context's query param containing a key 'key' ?
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export const queryContainsKey = (key: string) => (
  context: Partial<HookContext>,
): boolean => {
  return Object.keys(context.params?.query || {}).indexOf(key) > -1 && context.params?.query?.[key] !== null
}
