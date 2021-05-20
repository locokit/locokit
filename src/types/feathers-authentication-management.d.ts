declare module 'feathers-authentication-management' {

  export = authenticationLocalManagement
  function authenticationLocalManagement (options1?: {}, docs?: {}): () => void
  namespace authenticationLocalManagement {
    export { hooks }
  }
  namespace hooks {
    export { addVerification }
    export { isVerified }
    export { removeVerification }
  }
  function addVerification (path?: string): (hook: any) => Promise<any>
  function isVerified (): (hook: any) => void
  function removeVerification (ifReturnTokens?: boolean): (hook: any) => void

}
