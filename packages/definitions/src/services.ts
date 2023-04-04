/**
 * All services grouped by 'modules' :
 * * Authentication (login, profile, ...)
 * * Core : all resources at the top level, useful for admin tasks
 * * Workspace (datasource, dataset, table, field, group, ...)
 * * Misc (mailer, settings)
 */
export const SERVICES = {
  AUTH_AUTHENTICATION: '/auth/authentication',
  AUTH_MANAGEMENT: '/auth/management',
  AUTH_SIGNUP: '/auth/signup',

  MISC_MAILER: '/misc/mailer',

  CORE_WORKSPACE: '/core/workspace',
  CORE_DATASOURCE: '/core/datasource',
  CORE_TABLE: '/core/table',
  CORE_DATASET: '/core/dataset',
  CORE_USER: '/core/user',
  CORE_GROUP: '/core/group',
  CORE_USERGROUP: '/core/user-group',
  CORE_ROLE: '/core/role',

  /**
   * Workspaces dedicated service
   */
  WORKSPACE_DATASOURCE: '/workspace/:workspaceSlug/datasource',
  WORKSPACE_DATASOURCE_MERMAID: '/workspace/:workspaceSlug/datasource/:datasourceSlug/mermaid',

  WORKSPACE_USER: '/workspace/:workspaceSlug/user',
  WORKSPACE_GROUP: '/workspace/:workspaceSlug/group',
  WORKSPACE_USERGROUP: '/workspace/:workspaceSlug/user-group',
  WORKSPACE_ROLE: '/workspace/:workspaceSlug/role',

  WORKSPACE_TABLE: '/workspace/:workspaceSlug/datasource/:datasourceSlug/table',
  WORKSPACE_TABLE_FIELD:
    '/workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/field',
  WORKSPACE_TABLE_RELATION:
    '/workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/relation',
  WORKSPACE_TABLE_RECORD:
    '/workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/record',
  WORKSPACE_TABLE_DATASET:
    '/workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/dataset',
  WORKSPACE_TABLE_DATASET_FIELD:
    '/workspace/:workspaceSlug/datasource/:datasourceSlug/table/:tableSlug/dataset/:datasetSlug/field',

  WORKSPACE_MIGRATION: '/workspace/:workspaceSlug/datasource/:datasourceSlug/migration',
} as const