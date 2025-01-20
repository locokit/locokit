const ROUTE_NAMES = Object.freeze({
  HOME: 'home',
  ADMIN: {
    HOME: 'admin',
  },
  ACCOUNT: {
    SIGN_IN: 'account.sign_in',
    LOST_PASSWORD: 'account.lost_password',
    PROFILE: {
      ROOT: 'account.profile',
      UPDATE_GENERAL: 'account.profile.update_general',
      UPDATE_EMAIL: 'account.profile.update_email',
      UPDATE_PASSWORD: 'account.profile.update_password',
    },
  },
  WORKSPACE: {
    LIST: 'workspace.list',
  },
})

export default ROUTE_NAMES
