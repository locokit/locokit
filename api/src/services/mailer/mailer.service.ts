import { SmtpOptions } from 'nodemailer-smtp-transport'
import { Application } from '../../declarations'
import { MailerService, mailerHooks } from './mailer.class'

export function mailer(app: Application): void {
  // Initialize our service with any options it requires
  const mailerConfiguration = app.get('mail')

  const options: SmtpOptions = {
    host: mailerConfiguration.host,
    port: mailerConfiguration.port,
    secure: mailerConfiguration.secure,
  }
  if (mailerConfiguration.needAuth) {
    options.auth = {
      user: mailerConfiguration.user,
      pass: mailerConfiguration.pass,
    }
  }

  app.use(
    'mailer',
    new MailerService(options, {
      from: mailerConfiguration.from,
    }),
    {
      methods: ['create'],
    },
  )

  app.service('mailer').hooks(mailerHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    mailer: MailerService
  }
}
