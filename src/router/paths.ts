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

  /**
   * Workspace paths
   */
  WORKSPACE: '/workspace',
  VISUALIZATION: '/visualization',
  DATABASE: '/database',
  DATABASETABLE: '/table',
  DATABASESCHEMA: '/schema',
  PROCESS: '/process',
  ACL: '/acl',
  SETTINGS: '/settings',
  ACLSET: '/aclset',
  GROUP: '/group',
  CMS: '/cms',

  /**
   * Admin paths
   */
  ADMIN: '/admin',
  USERMANAGEMENT: '/usermanagement',
  GROUPMANAGEMENT: '/groupmanagement',
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

  /**
   * Workspace paths
   */
  WORKSPACE: 'WorkspaceList',
  VISUALIZATION: 'WorkspaceVisualization',
  PAGE: 'Page',
  PAGEDETAIL: 'PageDetail',
  WORKSPACE_ADMIN: {
    DATABASE: 'WorkspaceDatabase',
    DATABASETABLE: 'WorkspaceDatabaseTable',
    DATABASESCHEMA: 'WorkspaceDatabaseSchema',
    PROCESS: 'WorkspaceProcess',
    PROCESS_DETAIL: 'WorkspaceProcessDetail',
    ACL: 'WorkspaceACL',
    ACL_DETAIL: 'WorkspaceACLDetail',
    CMS: 'WorkspaceCMS',
    SETTINGS: 'WorkspaceSettings',
    GROUP: 'WorkspaceGroup',
    GROUP_DETAIL: 'WorkspaceGroupDetail',
  },

  /**
   * Admin paths
   */
  ADMIN: {
    USERMANAGEMENT: 'UserManagement',
    GROUPMANAGEMENT: 'GroupManagement',
  },

  /**
   * Other paths
   */
  404: '404',
}
