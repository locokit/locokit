import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Complete the data field of a row,
 * useful when patching a row,
 * to avoid an erase of all column values.
 */
export function completeDataField (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method !== 'patch') return context
    if (
      context.data.data &&
      context.params._meta?.item?.data
    ) {
      // find the matching row
      // const currentRow = await context.service.get(context.id as string)
      // enhance the data object
      context.data.data = {
        ...context.params._meta.item.data,
        ...context.data.data
      }
    }
    return context
  }
};
