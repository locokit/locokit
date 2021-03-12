import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * Get the current item to get all the actual data,
 * if request is a update / patch one,
 * and store it in context.params._meta.item field
 */
export function getCurrentItem (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch (context.method) {
      case 'update':
      case 'patch':
        // find the matching row
        context.params = {
          ...context.params,
          _meta: {
            item: await context.service.get(context.id as string),
          },
        }
        break
    }
    return context
  }
}
