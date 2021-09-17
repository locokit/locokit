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
    context.params.provider &&
    context.method === 'patch' &&
    context.type === 'after' &&
    context.params._meta?.item
  ) {
    // When updating the email address
    if ((context.params._meta.item as User).email !== context.result.email) {
      await Promise.all([
        // Notify the old email address
        authManagementSettings(context.app as Application).notifier(
          AuthenticationManagementAction.sendUpdatedEmailAddress,
          context.result,
          {
            emailAddress: context.params._meta.item.email,
          },
        ),
        // Notify the new email address
        authManagementSettings(context.app as Application).notifier(
          AuthenticationManagementAction.sendUpdatedEmailAddress,
          context.result,
        ),
      ])
    }
  }
  return context
}
