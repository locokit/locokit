import type { Application } from '../declarations'
import { authentication } from './authentication/authentication.service'
import { authmanagement } from './authmanagement/authmanagement.service'
import { users } from './users/users.service'
import { w } from './w/w.service'
import { mailer } from './mailer/mailer.service'
import { signup } from './signup/signup.service'

export const services = (app: Application): void => {
  /**
   * Auth / users / groups
   */
  app.configure(authentication)
  app.configure(authmanagement)
  app.configure(users)
  app.configure(signup)

  /**
   * Workspaces
   */
  app.configure(w)

  /**
   * Automations ?
   */

  /**
   * Utils
   */
  app.configure(mailer)
}
