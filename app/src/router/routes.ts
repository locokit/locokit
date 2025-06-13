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
      APPS: {
        ROOT: 'workspace.admin.apps',
        UUID: 'workspace.admin.apps.uuid',
      },
      DASHBOARDS: {
        ROOT: 'workspace.admin.dashboards',
        UUID: 'workspace.admin.dashboards.uuid',
      },
      DATASOURCES: {
        ROOT: 'workspace.admin.datasources',
        SLUG: 'workspace.admin.datasource.slug',
        CREATE: 'workspace.admin.datasource.create',
        TABLES: {
          ROOT: 'workspace.admin.datasource.slug.tables',
          SLUG: 'workspace.admin.datasource.slug.table.slug',
          CREATE: 'workspace.admin.datasource.slug.table.create',
          VIEWS: {
            ROOT: 'workspace.admin.datasource.slug.table.slug.views',
            SLUG: 'workspace.admin.datasource.slug.table.slug.view.slug',
            CREATE: 'workspace.admin.datasource.slug.table.slug.view.create',
          },
        },
      },
      POLICIES: {
        ROOT: 'workspace.admin.policies',
        UUID: 'workspace.admin.policies.uuid',
        CREATE: 'workspace.admin.policies.create',
      },
      GROUPS: {
        ROOT: 'workspace.admin.groups',
        UUID: 'workspace.admin.groups.uuid',
        CREATE: 'workspace.admin.groups.create',
      },
      USERS: {
        ROOT: 'workspace.admin.users',
        CREATE: 'workspace.admin.users.create',
      },
      MEDIAS: {
        ROOT: 'workspace.admin.medias',
        CREATE: 'workspace.admin.medias.create',
      },
      WORKFLOWS: {
        ROOT: 'workspace.admin.workflows',
        UUID: 'workspace.admin.workflows.uuid',
        CREATE: 'workspace.admin.workflows.create',
      },
      SETTINGS: 'workspace.admin.settings',
    },
  },
})

export default ROUTE_NAMES
