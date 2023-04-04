import { createResolver } from '@nuxt/kit'
import { NuxtPage } from '@nuxt/schema'
import { ROUTES_NAMES, ROUTES_PATH } from './paths'

const { resolve } = createResolver(import.meta.url)

/**
 * Build Nuxt Pages for auth submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getAuthPages(prefix: string): NuxtPage[] {
  return [
    {
      name: ROUTES_NAMES.AUTH.SIGN_IN,
      path: prefix + ROUTES_PATH.AUTH.SIGN_IN,
      file: resolve('./pages/auth/SignIn.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES_NAMES.AUTH.LOST_PASSWORD,
      path: prefix + ROUTES_PATH.AUTH.LOST_PASSWORD,
      file: resolve('./pages/auth/LostPassword.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES_NAMES.AUTH.VERIFY_SIGNUP,
      path: prefix + ROUTES_PATH.AUTH.VERIFY_SIGNUP,
      file: resolve('./pages/auth/VerifySignup.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES_NAMES.AUTH.RESET_PASSWORD,
      path: prefix + ROUTES_PATH.AUTH.RESET_PASSWORD,
      file: resolve('./pages/auth/ResetPassword.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES_NAMES.AUTH.SIGN_UP,
      path: prefix + ROUTES_PATH.AUTH.SIGN_UP,
      file: resolve('./pages/auth/SignUp.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES_NAMES.AUTH.ALREADY_AUTHENTICATED,
      path: prefix + ROUTES_PATH.AUTH.ALREADY_AUTHENTICATED,
      file: resolve('./pages/auth/AlreadyAuthenticated.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES_NAMES.AUTH.CONFIRM_UPDATE_EMAIL,
      path: prefix + ROUTES_PATH.AUTH.CONFIRM_UPDATE_EMAIL,
      file: resolve('./pages/auth/ConfirmUpdateEmail.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
  ]
}

// /**
//  * Build Nuxt Pages for user submodule
//  *
//  * @param prefix Prefix to add to auth pages paths
//  * @returns
//  */
// export function getUserPages(prefix: string): NuxtPage[] {
//   return [
//     {
//       name: ROUTES_NAMES.USER.PROFILE,
//       path: prefix + ROUTES_PATH.USER.PROFILE,
//       file: resolve('./pages/user/profile.vue'),
//       meta: {
//         anonymous: false,
//         protected: true,
//       },
//     },
//     {
//       name: ROUTES_NAMES.USER.UPDATEEMAIL,
//       path: prefix + ROUTES_PATH.USER.UPDATEEMAIL,
//       file: resolve('./pages/user/update-email.vue'),
//       meta: {
//         anonymous: false,
//         protected: true,
//       },
//     },
//   ]
// }
//
// /**
//  * Build Nuxt Pages for backoffice submodule
//  *
//  * @param prefix Prefix to add to auth pages paths
//  * @returns
//  */
// export function getBackofficePages(prefix: string): NuxtPage[] {
//   return [
//     {
//       name: ROUTES_NAMES.WORKSPACE.ADMIN.HOME,
//       path: prefix + ROUTES_PATH.WORKSPACE.ADMIN.HOME,
//       file: resolve('./pages/w/admin/index.vue'),
//       meta: {
//         anonymous: false,
//         protected: true,
//       },
//     },
//   ]
// }
//
// /**
//  * Build Nuxt Pages for frontoffice submodule
//  *
//  * @param prefix Prefix to add to auth pages paths
//  * @returns
//  */
// export function getFrontofficePages(prefix: string): NuxtPage[] {
//   return [
//     {
//       name: ROUTES_NAMES.WORKSPACE.APP.HOME,
//       path: prefix + ROUTES_PATH.WORKSPACE.APP.HOME,
//       file: resolve('./pages/w/app/index.vue'),
//       meta: {
//         anonymous: false,
//         protected: false,
//       },
//     },
//   ]
// }
