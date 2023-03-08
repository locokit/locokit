import type { Application } from '@/declarations'

import { authentication } from './auth/authentication/authentication'
import { authmanagement } from './auth/authmanagement/authmanagement'
import { user } from './auth/user/user'
import { signup } from './auth/signup/signup'

import { workspaceService } from './core/workspace/core-workspace'
import { coreDatasourceService } from './core/datasource/core-datasource'
import { coreTableService } from './core/table/core-table'
import { roleService } from './core/role/role'
import { groupService } from './core/group/group'
import { userGroupService } from './core/user-group/user-group'

import { datasourceService } from './workspace/datasource/datasource'
// import { migrationService } from './workspace/migration/migration'
import { tableService } from './workspace/table/table'
import { tableFieldService } from './workspace/table-field/table-field'
import { tableRecordService } from './workspace/table-record/table-record'
import { tableRelationService } from './workspace/table-relation/table-relation'
// import { datasetService } from './workspace/dataset/dataset'
// import { datasetFieldService } from './workspace/datasetField/datasetField'
// import { datasetRecordService } from './workspace/datasetRecord/datasetRecord'

import { mailer } from './mailer/mailer'
import { datasourceMermaidService } from './workspace/datasource-mermaid/datasource-mermaid'

export const services = (app: Application): void => {
  /**
   * Auth / user / groups
   */
  app.configure(authentication)
  app.configure(authmanagement)
  app.configure(user)
  app.configure(signup)

  /**
   * Core
   */
  app.configure(workspaceService)
  app.configure(coreDatasourceService)
  app.configure(coreTableService)
  app.configure(groupService)
  app.configure(userGroupService)
  app.configure(roleService)

  /**
   * Workspace dedicated endpoint
   * These endpoints are available as root endpoints
   * but also with route params
   */
  app.configure(datasourceService)
  app.configure(datasourceMermaidService)
  // app.configure(migrationService)
  app.configure(tableService)
  app.configure(tableFieldService)
  app.configure(tableRelationService)
  app.configure(tableRecordService)
  // app.configure(datasetService)
  // app.configure(datasetFieldService)
  // app.configure(datasetRecordService)

  /**
   * Automations (when it's done)
   */

  /**
   * Utils, unavailable for external
   */
  app.configure(mailer)
}
