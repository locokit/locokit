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
 * Core endpoints
 */
const WORKSPACE_ROOT: 'workspace' = 'workspace'
const DATASOURCE_ROOT: 'datasource' = 'datasource'
const TABLE_ROOT: 'table' = 'table'
const DATASET_ROOT: 'dataset' = 'dataset'

/**
 * Workspaces
 */
const WORKSPACE_DATASOURCE_ROOT: 'workspace/:workspaceSlug/datasource' =
  'workspace/:workspaceSlug/datasource'
const WORKSPACE_DATASOURCE_MERMAID: 'workspace/:workspaceSlug/datasource/:datasourceSlug/mermaid' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/mermaid'
const WORKSPACE_DATASOURCE_SWAGGER: 'workspace/:workspaceSlug/datasource/:datasourceSlug/swagger' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/swagger'

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
const WORKSPACE_DATASOURCE_MIGRATION: 'workspace/:workspaceSlug/datasource/:datasourceSlug/migration' =
  'workspace/:workspaceSlug/datasource/:datasourceSlug/migration'


const WORKSPACE_GROUP: 'workspace/:workspaceSlug/group' = 'workspace/:workspaceSlug/group'
const WORKSPACE_USERGROUP: 'workspace/:workspaceSlug/user-group' =
  'workspace/:workspaceSlug/user-group'


/**
 * All API paths grouped by 'modules' :
 * * Workspace (datasource, dataset, table, field, group, ...)
 * * Authentication (login, profile, ...)
 * * Administration (settings)
 */
export const API_PATH = {
  CORE: {
    DATASOURCE: DATASOURCE_ROOT,
    WORKSPACE: WORKSPACE_ROOT,
    TABLE: TABLE_ROOT,
    DATASET: DATASET_ROOT
  },
  WORKSPACE: {
    ROOT: WORKSPACE_ROOT,
    DATASOURCE: {
      ROOT: WORKSPACE_DATASOURCE_ROOT,
      MERMAID: WORKSPACE_DATASOURCE_MERMAID,
      SWAGGER: WORKSPACE_DATASOURCE_SWAGGER,
      TABLE: {
        ROOT: WORKSPACE_DATASOURCE_TABLE_ROOT,
        FIELD: WORKSPACE_DATASOURCE_TABLE_FIELD,
        RECORD: WORKSPACE_DATASOURCE_TABLE_RECORD,
        DATASET: WORKSPACE_DATASOURCE_TABLE_DATASET,
        RELATION: WORKSPACE_DATASOURCE_TABLE_RELATION,
      },
      MIGRATION: WORKSPACE_DATASOURCE_MIGRATION
    },

    GROUP: WORKSPACE_GROUP,
    USERGROUP: WORKSPACE_USERGROUP,
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

export const SERVICES = {
  AUTH_USER,

  CORE_WORKSPACE: API_PATH.CORE.WORKSPACE,
  CORE_DATASOURCE: API_PATH.CORE.DATASOURCE,
  CORE_TABLE: API_PATH.CORE.TABLE,
  CORE_DATASET: API_PATH.CORE.DATASET,

  WORKSPACE_DATASOURCE: WORKSPACE_DATASOURCE_ROOT,
  WORKSPACE_DATASOURCE_MERMAID,
  WORKSPACE_DATASOURCE_SWAGGER,
  WORKSPACE_DATASOURCE_MIGRATION,

  WORKSPACE_TABLE: WORKSPACE_DATASOURCE_TABLE_ROOT,
  WORKSPACE_TABLE_FIELD: WORKSPACE_DATASOURCE_TABLE_FIELD,
  WORKSPACE_TABLE_RELATION: WORKSPACE_DATASOURCE_TABLE_RELATION,
  WORKSPACE_TABLE_RECORD: WORKSPACE_DATASOURCE_TABLE_RECORD
}