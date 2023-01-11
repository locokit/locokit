export const ROUTES_NAMES = {
  HOME: 'Home',

  /**
   * Auth paths
   */
  AUTH: {
    LOST_PASSWORD: 'LostPassword',
    VERIFY_SIGNUP: 'VerifySignup',
    RESET_PASSWORD: 'ResetPassword',
    UPDATE_EMAIL: 'UpdateEmail',
    SIGN_UP: 'SignUp',
    SIGN_IN: 'SignIn',
    ALREADY_AUTHENTICATED: 'AlreadyAuthenticated',
  },

  WORKSPACE: {
    HOME: 'Workspace',
    CREATE: 'CreateWorkspace',
  },

  PROFILE: {
    HOME: 'Profile',
    UPDATE_USERNAME: 'Username',
    UPDATE_EMAIL: 'UpdateEmail',
    UPDATE_PASSWORD: 'UpdatePassword',
  },
}

export const ROUTES_PATH = {
  HOME: '/',

  /**
   * Auth paths
   */
  AUTH: {
    LOST_PASSWORD: '/auth/lost-password',
    VERIFY_SIGNUP: '/auth/verify-signup',
    RESET_PASSWORD: '/auth/reset-password',
    SIGN_UP: '/auth/sign-up',
    SIGN_IN: '/auth/sign-in',
    ALREADY_AUTHENTICATED: '/auth/already-authenticated',
  },

  /**
   * User paths
   */
  PROFILE: {
    HOME: '/profile',
    UPDATE_USERNAME: '/profile/username',
    UPDATE_EMAIL: '/profile/update-email',
    UPDATE_PASSWORD: '/profile/update-password',
  },

  /**
   * Workspace paths
   */
  WORKSPACE: {
    HOME: '/w',
    CREATE: '/w/create',
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
