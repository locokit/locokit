export const ROUTES_NAMES = {
  HOME: 'Home',

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
    WORKSPACES: 'Workspaces',
    CREATE_WORKSPACE: 'CreateWorkspace',
    HOME: 'Workspace',
    DASHBOARD: 'Dashboard',
    DATASOURCE: {
      HOME: 'Datasource',
      ABOUT: 'AboutDatasource',
      CREATE: 'CreateDatasource',
      SCHEMA: 'SchemaDatasource',
    },
    SETTINGS: 'Settings',
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

  AUTH: {
    LOST_PASSWORD: '/auth/lost-password',
    VERIFY_SIGNUP: '/auth/verify-signup',
    RESET_PASSWORD: '/auth/reset-password',
    SIGN_UP: '/auth/sign-up',
    SIGN_IN: '/auth/sign-in',
    ALREADY_AUTHENTICATED: '/auth/already-authenticated',
    CONFIRM_UPDATE_EMAIL: '/auth/confirm-update-email',
  },

  PROFILE: {
    HOME: '/profile',
    UPDATE_GENERAL: '/profile/general',
    UPDATE_EMAIL: '/profile/email',
    UPDATE_PASSWORD: '/profile/password',
  },

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
    WORKSPACES: '/w',
    CREATE_WORKSPACE: '/w/create',
    HOME: '/w/:id',
    DASHBOARD: '/w/:id/dashboard',
    DATASOURCE: {
      HOME: '/w/:id/datasource',
      ABOUT: '/w/:id/datasource/about',
      CREATE: '/w/:id/datasource/create',
      SCHEMA: '/w/:id/datasource/schema',
    },
    SETTINGS: '/w/:id/settings',
  },
}
