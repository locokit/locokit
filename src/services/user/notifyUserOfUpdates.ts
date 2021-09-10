import { Application } from '@feathersjs/express'
import { Hook, HookContext } from '@feathersjs/feathers'
import { User } from '../../models/user.model'
import { AuthenticationManagementAction, authManagementSettings } from '../authmanagement/authmanagement.settings'

/**
 * Notify the user when its properties have been updated.
 * @param context Hook context
 * @returns the input context
 */
export function notifyUserOfUpdates (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.params.provider && // External call
      context.params._meta?.item && // Previous data have been loaded
      context.result // Saved data
    ) {
      // The account status (blocked) has been updated
      if ((context.result as User).blocked !== (context.params._meta.item as User).blocked) {
        await authManagementSettings(context.app as Application).notifier(
          context.result.blocked
            ? AuthenticationManagementAction.disableUser
            : AuthenticationManagementAction.enableUser,
          context.result,
        )
      }
    }
    return context
  }
}
