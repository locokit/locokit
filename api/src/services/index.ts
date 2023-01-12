import type { Application } from '../declarations'
import { authentication } from './auth/authentication/authentication.service'
import { authmanagement } from './auth/authmanagement/authmanagement.service'
import { user } from './auth/user/user.service'
import { workspaceService } from './workspace/workspace.service'
import { mailer } from './mailer/mailer.service'
import { signup } from './auth/signup/signup.service'
import { datasourceService } from './workspace/datasource/datasource.service'
// import { tableService } from './workspace/datasource/table/table.service'
// import { recordService } from './workspace/datasource/table/record/record.service'

export const services = (app: Application): void => {
  /**
   * Auth / user / groups
   */
  app.configure(authentication)
  app.configure(authmanagement)
  app.configure(user)
  app.configure(signup)

  /**
   * Workspaces
   */
  app.configure(workspaceService)
  app.configure(datasourceService)
  // app.configure(tableService)
  // app.configure(recordService)
  // app.configure(tableRelationService)
  // app.configure(fieldService)
  // app.configure(datasetService)

  /**
   * Automations ?
   */

  /**
   * Utils
   */
  app.configure(mailer)
}
