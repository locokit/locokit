declare module 'feathers-authentication-management' {

  import { HookContext } from '@feathersjs/feathers'
  function authenticationLocalManagement (options1?: {}, docs?: {}): () => void
  namespace authenticationLocalManagement {
    export { hooks }
  }
  namespace hooks {
    export { addVerification }
    export { isVerified }
    export { removeVerification }
  }
  function addVerification (path?: string): (hook: HookContext) => Promise<HookContext>
  function isVerified (): (hook: HookContext) => void
  function removeVerification (ifReturnTokens?: boolean): (hook: HookContext) => void

  export = authenticationLocalManagement
}
