import { HookContext } from '@feathersjs/feathers';

/**
 * Is the context's data containing the field "data" ?
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export function isDataSent (context: Partial<HookContext>): boolean {
  return context.data &&
    context.data.data !== null &&
    context.data.data !== undefined
}
