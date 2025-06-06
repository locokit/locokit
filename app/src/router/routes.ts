const ROUTE_NAMES = Object.freeze({
  HOME: 'home',
  ADMIN: {
    ROOT: 'admin',
    USERS: {
      ROOT: 'admin.users',
      CREATE: 'admin.users.create',
      RECORD: 'admin.users.record',
    },
    GROUPS: {
      ROOT: 'admin.groups',
      CREATE: 'admin.groups.create',
      RECORD: 'admin.groups.record',
    },
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
    CREATE: 'workspace.create',
    SLUG: 'workspace.slug',
    ADMIN: {
      ROOT: 'workspace.admin',
      DASHBOARDS: 'workspace.admin.dashboards',
      DATASOURCES: {
        ROOT: 'workspace.admin.datasources',
        SLUG: 'workspace.admin.datasource.slug',
        TABLES: {
          ROOT: 'workspace.admin.datasource.slug.tables',
          SLUG: 'workspace.admin.datasource.slug.table.slug',
          VIEWS: {
            ROOT: 'workspace.admin.datasource.slug.table.slug.views',
            SLUG: 'workspace.admin.datasource.slug.table.slug.view.slug',
          },
        },
      },
      APPS: 'workspace.admin.apps',
      GROUPS: 'workspace.admin.groups',
      POLICIES: 'workspace.admin.policies',
      USERS: 'workspace.admin.users',
      MEDIAS: 'workspace.admin.medias',
      WORKFLOWS: 'workspace.admin.workflows',
      SETTINGS: 'workspace.admin.settings',
    },
  },
})

export default ROUTE_NAMES
