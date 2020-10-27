// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import hooks from './mailer.hooks'
import { Mailer } from './mailer.class'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'mailer': Mailer & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  const mailerConfiguration = app.get('mail')
  app.use('/mailer', new Mailer({
    host: mailerConfiguration.host,
    port: mailerConfiguration.port,
    secure: false,
    auth: {
      user: mailerConfiguration.user,
      pass: mailerConfiguration.pass
    }
  }, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer')

  service.hooks(hooks)
}
