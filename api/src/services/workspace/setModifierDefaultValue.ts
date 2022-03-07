import { HookContext } from '@feathersjs/feathers'

/**
 * Set objection modifier default values.
 *
 * @param context Hook context
 * @returns a Hook context enhanced with new data
 */
export const setModifierDefaultValues = (defaultValuesByModifier: Record<string, any> = {}) => {
  return async (context: HookContext): Promise<HookContext> => {
    /**
     * First check we are on a find/get before hook
     */
    if (
      !(
        (
          context.method === 'find' ||
          context.method === 'get'
        ) &&
        context.type === 'before'
      ) || !context.params.query ||
      !context.params.query.$modify
    ) return context

    /**
     * For each modifier, we check there is a default value.
     * If so, we set it.
     */
    const modify = context.params.query?.$modify

    let modifiers: Record<string, any> = {}
    if (typeof modify === 'string') {
      if (modify[0] === '[' && modify[modify.length - 1] === ']') {
        JSON.parse(modify).forEach(function (currentKeyModify: string) {
          modifiers[currentKeyModify] = null
        })
      } else if (modify[0] === '{' && modify[modify.length - 1] === '}') {
        modifiers = JSON.parse(modify)
      } else {
        modify.split(',').forEach(function (currentKeyModify: string) {
          modifiers[currentKeyModify] = null
        })
      }
    } else if (Array.isArray(modify)) {
      modify.forEach(function (currentKeyModify: string | object) {
        if (typeof currentKeyModify === 'string') {
          modifiers[currentKeyModify] = null
        } else {
          for (const [modifier, args] of Object.entries(currentKeyModify)) {
            modifiers[modifier] = args
          }
        }
      })
    } else {
      modifiers = modify
    }

    const modifierKeys = Object.keys(modifiers || {})
    if (modifierKeys.length === 0) return context

    modifierKeys.forEach(currentModifierKey => {
      const defaultValue = defaultValuesByModifier[currentModifierKey]
      if (defaultValue) {
        let valueToInject = defaultValue
        if (typeof valueToInject === 'string') {
          valueToInject = parseInt(valueToInject.replaceAll('{userId}', context.params.user?.id))
          modifiers[currentModifierKey] = [valueToInject]
        }
      }
    })

    context.params.query.$modify = modifiers

    return context
  }
}
