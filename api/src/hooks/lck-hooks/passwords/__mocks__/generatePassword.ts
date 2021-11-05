import { getItems } from 'feathers-hooks-common'
import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * This mock returns always the same password
 */
export function generatePassword (): Hook {
  return async function (hook: HookContext) {
    const user = getItems(hook)
    user.password = 'pouetP@0'
    return hook
  }
}
