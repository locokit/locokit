// Initializes the `settings` service on path `/settings`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Settings } from './settings.class'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'settings': Settings & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use('/settings', new Settings(app))
}
