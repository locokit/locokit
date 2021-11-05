import { Application } from '@feathersjs/express'
import { HookContext } from '@feathersjs/feathers'
import { User } from '../../models/user.model'
import { AuthenticationManagementAction, authManagementSettings } from '../authmanagement/authmanagement.settings'

/**
 * Notify the user when its properties have been updated from a patch request.
 * @param context Hook context
 * @returns the input context
 */
export async function notifyUserOnUpdate (context: HookContext): Promise<HookContext> {
  // Check we are on an external user patch after hook and that the previous data have been loaded from the database
  if (
    context.params.provider && // External call
    context.method === 'patch' &&
    context.result && // Saved data
    context.params._meta?.item // Previous data have been loaded
  ) {
    const notificationPromises: Array<Promise<any>> = []

    // The email address has been updated
    if ((context.params._meta.item as User).email !== context.result.email) {
      // Notify the old email address
      notificationPromises.push(
        authManagementSettings(context.app as Application).notifier(
          AuthenticationManagementAction.sendUpdatedEmailAddress,
          context.result,
          {
            emailAddress: context.params._meta.item.email,
          },
        ),
      )
      // Notify the new email address
      notificationPromises.push(
        authManagementSettings(context.app as Application).notifier(
          AuthenticationManagementAction.sendUpdatedEmailAddress,
          context.result,
        ),
      )
    }

    // The account status (blocked) has been updated
    if ((context.result as User).blocked !== (context.params._meta.item as User).blocked) {
      notificationPromises.push(
        authManagementSettings(context.app as Application).notifier(
          context.result.blocked
            ? AuthenticationManagementAction.disableUser
            : AuthenticationManagementAction.enableUser,
          context.result,
        ),
      )
    }

    // Notify the user
    if (notificationPromises.length > 0) await Promise.all(notificationPromises)
  }
  return context
}
