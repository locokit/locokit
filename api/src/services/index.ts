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

import { mailer } from './mailer/mailer'
import { datasourceMermaidService } from './workspace/datasource-mermaid/datasource-mermaid'
import { workflowService } from './workspace/workflow/workflow'
import { workflowRunService } from './workspace/workflow-run/workflow-run'

import { workspacePolicyService } from './workspace/policy/policy'
import { workspacePolicyVariableService } from './workspace/policy-variable/policy-variable'
import { workspacePolicyTableService } from './workspace/policy-table/policy-table'
import { workspacePolicyTableFieldService } from './workspace/policy-table-field/policy-table-field'

import { workspaceGroupService } from './workspace/group/group'
import { workspaceGroupPolicyVariableService } from './workspace/group-policy-variable/group-policy-variable'
import { workspaceUserGroupService } from './workspace/user-group/user-group'
import { workspaceUserGroupPolicyVariableService } from './workspace/user-group-policy-variable/user-group-policy-variable'
import { userSignup } from './workspace/user-signup/user-signup'

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

  app.configure(workspacePolicyService)
  app.configure(workspacePolicyVariableService)
  app.configure(workspacePolicyTableService)
  app.configure(workspacePolicyTableFieldService)

  app.configure(workspaceGroupService)
  app.configure(workspaceGroupPolicyVariableService)
  app.configure(workspaceUserGroupService)
  app.configure(workspaceUserGroupPolicyVariableService)

  app.configure(userSignup)

  /**
   * Workflows
   */
  app.configure(workflowService)
  app.configure(workflowRunService)

  /**
   * Utils, unavailable for external
   */
  app.configure(mailer)
}
