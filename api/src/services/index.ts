import { w } from './w/w.service'
import { users } from './users'
// import { workspaces } from './workspace'
import type { Application } from '../declarations'

export const services = (app: Application): void => {
  app.configure(w)
  app.configure(users)
  // app.configure(workspaces)
  // All services will be registered here
}
