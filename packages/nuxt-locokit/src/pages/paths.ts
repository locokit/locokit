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
