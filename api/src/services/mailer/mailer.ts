import { SERVICES } from '@locokit/definitions'
import SMTPConnection from 'nodemailer/lib/smtp-connection'
import { Application } from '../../declarations'
import { MailerService, mailerHooks } from './mailer.class'

export function mailer(app: Application): void {
  // Initialize our service with any options it requires
  const mailerConfiguration = app.get('mail')

  const options: SMTPConnection.Options = {
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
    SERVICES.MISC_MAILER,
    new MailerService(options, {
      from: mailerConfiguration.from,
    }),
    {
      methods: ['create'],
    },
  )

  app.service(SERVICES.MISC_MAILER).hooks(mailerHooks)
}

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.MISC_MAILER]: MailerService
  }
}
