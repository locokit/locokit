import { authorize } from 'feathers-casl/dist/hooks'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'

export function authorizeWrapper (): IffHook {
  return iff(
    isProvider('external'),
    authorize({
      adapter: 'feathers-objection',
    }),
  )
}
