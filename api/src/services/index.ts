import type { Application } from '@/declarations'

import { authentication } from './auth/authentication/authentication'
import { authmanagement } from './auth/authmanagement/authmanagement'
import { user } from './core/user/user'
import { signup } from './auth/signup/signup'

import { workspaceService } from './core/workspace/workspace'
import { coreDatasourceService } from './core/datasource/datasource'
import { coreTableService } from './core/table/table'
import { policyService } from './core/policy/policy'
import { groupService } from './core/group/group'
import { userGroupService } from './core/user-group/user-group'

import { workspaceDatasourceService } from './workspace/datasource/datasource'
import { migrationService } from './workspace/migration/migration'
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
  app.configure(signup)

  /**
   * Core
   */
  app.configure(user)
  app.configure(groupService)
  app.configure(userGroupService)
  app.configure(workspaceService)
  app.configure(policyService)
  app.configure(coreDatasourceService)
  app.configure(coreTableService)

  /**
   * Workspace dedicated endpoint
   * These endpoints are available with route params (only ?...)
   */
  app.configure(workspaceDatasourceService)
  app.configure(datasourceMermaidService)
  app.configure(migrationService)
  app.configure(tableService)
  app.configure(tableFieldService)
  app.configure(tableRelationService)
  app.configure(tableRecordService)
  // app.configure(datasetService)
  // app.configure(datasetFieldService)
  // app.configure(datasetRecordService)

  /**
   * Automations (when it will be done)
   */

  /**
   * Applications (when it will be done)
   */

  /**
   * Utils, unavailable for external
   */
  app.configure(mailer)
}
