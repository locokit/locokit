import { createResolver } from '@nuxt/kit'
import { NuxtPage } from '@nuxt/schema'
const { resolve } = createResolver(import.meta.url)

export const ROUTES = {
  HOME: '/',

  /**
   * Auth paths
   */
  AUTH: {
    LOSTPASSWORD: '/auth/lost-password',
    VERIFYSIGNUP: '/auth/verify-signup',
    RESETPASSWORD: '/auth/reset-password',
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
  },

  /**
   * User paths
   */
  USER: {
    PROFILE: '/user/profile',
    UPDATEEMAIL: '/user/update-email',
  },

  /**
   * Workspace paths
   */
  WORKSPACE: {
    HOME: '/w',
    DETAIL: '/w/:w',
    /**
     * Front office
     */
    APP: {
      HOME: '/app',
      GROUP: '/app/:group',
      GROUP_PAGES: '/app/:group/p',
      GROUP_PAGE: '/app/:group/p/:page',
      GROUP_PAGE_DETAIL: '/app/:group/p/:page/d',
    },
    /**
     * Back office
     */
    ADMIN: {
      HOME: '/admin', // settings + stats
      // SETTINGS: '/settings',
      APP: {
        HOME: '/app',
        GROUP: '/:group',
        GROUP_PAGES: '/p',
        GROUP_PAGE: '/:page',
        GROUP_PAGE_DETAIL: '/d',
      },
      DATA_PROVIDERS: {
        HOME: '/dps',
        SETTINGS: '/:dp/settings',
        SCHEMA: '/:dp/schema',
        TABLES: '/:dp/t',
        TABLE: '/:dp/t/:table',
        TABLE_VIEWS: '/:dp/t/:table/v',
        TABLE_VIEW: '/:dp/t/:table/v/:view',
      },
      AUTOMATIONS: {
        HOME: '/automations',
      },
      MEDIAS: '/media',
      PERMISSIONS: {
        HOME: '/permissions',
        ACL: '/permissions/:acl',
      },
      USERS: {
        HOME: '/users',
        USER: '/users/:id',
      },
      GROUPS: {
        HOME: '/groups',
        GROUP: '/groups/:id',
      },
    },
  },

  /**
   * Administration
   */
  ADMIN: {
    HOME: '/admin',
    USERS: {
      HOME: '/admin/users',
      DETAIL: '/admin/users/:id',
    },
    GROUPS: {
      HOME: '/admin/groups',
      DETAIL: '/admin/groups/:id',
    },
  },
}

/**
 * Build Nuxt Pages for auth submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getAuthPages (prefix: string): NuxtPage[] {
  return [{
    name: ROUTES.AUTH.LOGIN,
    path: prefix + ROUTES.AUTH.LOGIN,
    file: resolve('./auth/login.vue'),
  }, {
    name: ROUTES.AUTH.LOSTPASSWORD,
    path: prefix + ROUTES.AUTH.LOSTPASSWORD,
    file: resolve('./auth/lost-password.vue'),
  }, {
    name: ROUTES.AUTH.VERIFYSIGNUP,
    path: prefix + ROUTES.AUTH.VERIFYSIGNUP,
    file: resolve('./auth/verify-signup.vue'),
  }, {
    name: ROUTES.AUTH.RESETPASSWORD,
    path: prefix + ROUTES.AUTH.RESETPASSWORD,
    file: resolve('./auth/reset-password.vue'),
  }, {
    name: ROUTES.AUTH.SIGNUP,
    path: prefix + ROUTES.AUTH.SIGNUP,
    file: resolve('./auth/signup.vue'),
  }]
}

/**
 * Build Nuxt Pages for user submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getUserPages (prefix: string): NuxtPage[] {
  return [{
    name: ROUTES.USER.PROFILE,
    path: prefix + ROUTES.USER.PROFILE,
    file: resolve('./user/profile.vue'),
  }, {
    name: ROUTES.USER.UPDATEEMAIL,
    path: prefix + ROUTES.USER.UPDATEEMAIL,
    file: resolve('./user/update-email.vue'),
  }]
}

/**
 * Build Nuxt Pages for backoffice submodule
 *
 * @param prefix Prefix to add to auth pages paths
 * @returns
 */
export function getBackofficePages (prefix: string): NuxtPage[] {
  return [{
    name: ROUTES.WORKSPACE.ADMIN.HOME,
    path: prefix + ROUTES.WORKSPACE.ADMIN.HOME,
    file: resolve('./w/admin/index.vue'),
  }, {
    name: ROUTES.AUTH.LOSTPASSWORD,
    path: prefix + ROUTES.AUTH.LOSTPASSWORD,
    file: resolve('./auth/lost-password.vue'),
  }, {
    name: ROUTES.AUTH.VERIFYSIGNUP,
    path: prefix + ROUTES.AUTH.VERIFYSIGNUP,
    file: resolve('./auth/verify-signup.vue'),
  }, {
    name: ROUTES.AUTH.RESETPASSWORD,
    path: prefix + ROUTES.AUTH.RESETPASSWORD,
    file: resolve('./auth/reset-password.vue'),
  }, {
    name: ROUTES.AUTH.SIGNUP,
    path: prefix + ROUTES.AUTH.SIGNUP,
    file: resolve('./auth/signup.vue'),
  }]
}
