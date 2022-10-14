import { createResolver } from '@nuxt/kit'
import { NuxtPage } from '@nuxt/schema'
import { ROUTES } from './pages/paths'

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
      name: ROUTES.AUTH.LOGIN,
      path: prefix + ROUTES.AUTH.LOGIN,
      file: resolve('./pages/auth/login.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES.AUTH.LOSTPASSWORD,
      path: prefix + ROUTES.AUTH.LOSTPASSWORD,
      file: resolve('./pages/auth/lost-password.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES.AUTH.VERIFYSIGNUP,
      path: prefix + ROUTES.AUTH.VERIFYSIGNUP,
      file: resolve('./pages/auth/verify-signup.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES.AUTH.RESETPASSWORD,
      path: prefix + ROUTES.AUTH.RESETPASSWORD,
      file: resolve('./pages/auth/reset-password.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
    {
      name: ROUTES.AUTH.SIGNUP,
      path: prefix + ROUTES.AUTH.SIGNUP,
      file: resolve('./pages/auth/signup.vue'),
      meta: {
        anonymous: true,
        protected: false,
      },
    },
  ]
}

/**
 * Build Nuxt Pages for user submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getUserPages(prefix: string): NuxtPage[] {
  return [
    {
      name: ROUTES.USER.PROFILE,
      path: prefix + ROUTES.USER.PROFILE,
      file: resolve('./pages/user/profile.vue'),
      meta: {
        anonymous: false,
        protected: true,
      },
    },
    {
      name: ROUTES.USER.UPDATEEMAIL,
      path: prefix + ROUTES.USER.UPDATEEMAIL,
      file: resolve('./pages/user/update-email.vue'),
      meta: {
        anonymous: false,
        protected: true,
      },
    },
  ]
}

/**
 * Build Nuxt Pages for backoffice submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getBackofficePages(prefix: string): NuxtPage[] {
  return [
    {
      name: ROUTES.WORKSPACE.ADMIN.HOME,
      path: prefix + ROUTES.WORKSPACE.ADMIN.HOME,
      file: resolve('./pages/w/admin/index.vue'),
      meta: {
        anonymous: false,
        protected: true,
      },
    },
  ]
}

/**
 * Build Nuxt Pages for frontoffice submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getFrontofficePages(prefix: string): NuxtPage[] {
  return [
    {
      name: ROUTES.WORKSPACE.APP.HOME,
      path: prefix + ROUTES.WORKSPACE.APP.HOME,
      file: resolve('./pages/w/app/index.vue'),
      meta: {
        anonymous: false,
        protected: false,
      },
    },
  ]
}
