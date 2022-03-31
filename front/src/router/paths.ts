export const ROUTES_PATH = {
  HOME: '/',

  /**
   * User paths
   */
  LOSTPASSWORD: '/lost-password',
  VERIFYSIGNUP: '/verify-signup',
  RESETPASSWORD: '/reset-password',
  PROFILE: '/profile',
  UPDATEEMAIL: '/update-email',
  SIGNUP: '/signup',

  /**
   * Workspace paths
   */
  WORKSPACE: '/workspace',
  VISUALIZATION: '/visualization',
  VISUALIZATION_PAGE: '/page',
  VISUALIZATION_PAGE_DETAIL: '/detail',
  DATABASE: '/database',
  DATABASETABLE: '/table',
  DATABASESCHEMA: '/schema',
  PROCESS: '/process',
  ACL: '/acl',
  SETTINGS: '/settings',
  FILES: '/files',
  ACLSET: '/aclset',
  GROUP: '/group', // used in workspace admin AND admin
  CMS: '/cms',
  CMS_PAGE: '/page',
  CMS_PAGE_DETAIL: '/detail',

  /**
   * Admin paths
   */
  ADMIN: '/admin',
  USER: '/user',
}

export const ROUTES_NAMES = {
  HOME: 'Home',

  /**
   * User paths
   */
  LOSTPASSWORD: 'LostPassword',
  VERIFYSIGNUP: 'VerifySignup',
  RESETPASSWORD: 'ResetPassword',
  PROFILE: 'Profile',
  UPDATEEMAIL: 'UpdateEmail',
  SIGNUP: 'SignUp',

  /**
   * Workspace paths
   */
  WORKSPACELIST: 'WorkspaceList',
  WORKSPACE: 'Workspace',
  WORKSPACE_ADMIN: {
    DATABASE: 'WorkspaceDatabase',
    DATABASETABLE: 'WorkspaceDatabaseTable',
    DATABASESCHEMA: 'WorkspaceDatabaseSchema',
    PROCESS: 'WorkspaceProcess',
    PROCESS_DETAIL: 'WorkspaceProcessDetail',
    ACL: 'WorkspaceACL',
    ACL_DETAIL: 'WorkspaceACLDetail',
    CMS: 'WorkspaceCMS',
    CMS_PAGE: 'WorkspaceCMSPage',
    CMS_PAGE_DETAIL: 'WorkspaceCMSPageDetail',
    SETTINGS: 'WorkspaceSettings',
    FILES: 'WorkspaceFiles',
    GROUP: 'WorkspaceGroup',
    GROUP_DETAIL: 'WorkspaceGroupDetail',
  },

  VISUALIZATION: 'WorkspaceVisualization',
  WORKSPACE_VISUALIZATION: {
    PAGE: 'WorkspaceVisualizationPage',
    PAGE_DETAIL: 'WorkspaceVisualizationPageDetail',
  },

  /**
   * Admin paths
   */
  ADMIN: {
    USER: 'AdminUser',
    GROUP: 'AdminGroup',
    GROUP_DETAIL: 'AdminGroupDetail',
  },

  /**
   * Other paths
   */
  404: '404',
}
