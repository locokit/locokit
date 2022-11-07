import { Application, Service } from '@feathersjs/feathers'

export interface SDKOptions {
  apiURL: string
  socketEnabled?: boolean
  fetch: Function
}

export interface SDK {
  client: Application
  services: {
    /**
     * Workspace
     */
    workspace: Service

    /**
     * User
     */
    user: Service
    group: Service
  }
}
