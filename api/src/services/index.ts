import { users } from './users'
import { workspaces } from './workspace'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(users)
  app.configure(workspaces)
  // All services will be registered here
}
