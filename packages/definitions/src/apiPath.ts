/**
 * Workspaces
 */
const WORKSPACE_ROOT: 'workspace' = 'workspace'
const WORKSPACE_DATASOURCE_ROOT: 'workspace/:workspaceSlug/datasource' =
  'workspace/:workspaceSlug/datasource'
const WORKSPACE_DATASOURCE_TABLE_ROOT: 'workspace/:workspaceSlug/datasource/:datasourceSlug/table' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/table'
const WORKSPACE_DATASOURCE_TABLE_FIELD: 'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/field' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/field'
const WORKSPACE_DATASOURCE_TABLE_RECORD: 'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/record' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/record'
const WORKSPACE_DATASOURCE_TABLE_DATASET: 'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/dataset' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/dataset'
const WORKSPACE_DATASOURCE_TABLE_RELATION: 'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/relation' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/relation'
const WORKSPACE_GROUP: 'workspace/:workspaceSlug/group' = 'workspace/:workspaceSlug/group'

/**
 * Authentication / management / profile
 */
const AUTH_ROOT: 'authentication' = 'authentication'
const AUTH_MANAGEMENT: 'auth-management' = 'auth-management'
const AUTH_USER: 'user' = 'user'
const AUTH_GROUP: 'group' = 'group'
const AUTH_USERGROUP: 'user-group' = 'user-group'
const AUTH_ROLE: 'role' = 'role'
const AUTH_SIGNUP: 'signup' = 'signup'

/**
 * Administration
 */
const ADMIN_SETTINGS = 'settings'

/**
 * All API paths grouped by 'modules' :
 * * Workspace (datasource, dataset, table, field, group, ...)
 * * Authentication (login, profile, ...)
 * * Administration (settings)
 */
export const API_PATH = {
  WORKSPACE: {
    ROOT: WORKSPACE_ROOT,
    DATASOURCE: {
      ROOT: WORKSPACE_DATASOURCE_ROOT,
      TABLE: {
        ROOT: WORKSPACE_DATASOURCE_TABLE_ROOT,
        FIELD: WORKSPACE_DATASOURCE_TABLE_FIELD,
        RECORD: WORKSPACE_DATASOURCE_TABLE_RECORD,
        DATASET: WORKSPACE_DATASOURCE_TABLE_DATASET,
        RELATION: WORKSPACE_DATASOURCE_TABLE_RELATION,
      },
    },

    GROUP: WORKSPACE_GROUP,
  },
  AUTH: {
    ROOT: AUTH_ROOT,
    MANAGEMENT: AUTH_MANAGEMENT,
    USER: AUTH_USER,
    GROUP: AUTH_GROUP,
    USERGROUP: AUTH_USERGROUP,
    SIGNUP: AUTH_SIGNUP,
    ROLE: AUTH_ROLE,
  },
  ADMIN: {
    SETTINGS: ADMIN_SETTINGS,
  },
}
