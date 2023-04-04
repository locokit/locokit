export const ROUTES_NAMES = {
  HOME: 'Home',

  /**
   * Auth paths
   */
  AUTH: {
    LOST_PASSWORD: 'LostPassword',
    VERIFY_SIGNUP: 'VerifySignup',
    RESET_PASSWORD: 'ResetPassword',
    SIGN_UP: 'SignUp',
    SIGN_IN: 'SignIn',
    ALREADY_AUTHENTICATED: 'AlreadyAuthenticated',
    CONFIRM_UPDATE_EMAIL: 'ConfirmUpdateEmail',
  },

  WORKSPACE: {
    HOME: 'Workspace',
    CREATE: 'CreateWorkspace',
  },

  PROFILE: {
    HOME: 'Profile',
    UPDATE_GENERAL: 'UpdateGeneral',
    UPDATE_EMAIL: 'UpdateEmail',
    UPDATE_PASSWORD: 'UpdatePassword',
  },

  ADMIN: {
    HOME: 'Admin',
    USERS: {
      HOME: 'Users',
      ABOUT: 'AboutUsers',
      CREATE: 'CreateUser',
      RECORD: 'RecordUser',
    },
    GROUPS: {
      HOME: 'Groups',
      ABOUT: 'AboutGroups',
      CREATE: 'CreateGroup',
      RECORD: 'RecordGroup',
    },
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
    CONFIRM_UPDATE_EMAIL: '/auth/confirm-update-email',
  },

  /**
   * User paths
   */
  PROFILE: {
    HOME: '/profile',
    UPDATE_GENERAL: '/profile/general',
    UPDATE_EMAIL: '/profile/email',
    UPDATE_PASSWORD: '/profile/password',
  },

  /**
   * Administration
   */
  ADMIN: {
    HOME: '/admin',
    USERS: {
      HOME: '/admin/users',
      ABOUT: '/admin/users/about',
      CREATE: '/admin/users/create-user',
      RECORD: '/admin/users/record/:id',
    },
    GROUPS: {
      HOME: '/admin/groups',
      ABOUT: '/admin/groups/about',
      CREATE: '/admin/groups/create-group',
      RECORD: '/admin/groups/record/:id',
    },
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
}
