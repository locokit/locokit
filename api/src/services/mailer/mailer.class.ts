import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'

import { disallow } from 'feathers-hooks-common'
import SMTPConnection from 'nodemailer/lib/smtp-connection'
import { logger } from '../../logger'

const mailerLogger = logger.child({ service: 'mailer' })

export class MailerService {
  transporter: Transporter

  constructor(options: SMTPConnection.Options, defaults: { from?: string }) {
    if (!options) throw new Error('mailer service: constructor `options` must be provided')

    this.transporter = nodemailer.createTransport(options, defaults)
  }

  async create(data: Partial<SendMailOptions>): Promise<SentMessageInfo> {
    mailerLogger.info('Sending email to %s with subject : %s', data.to, data.subject)
    return await this.transporter.sendMail(data)
  }
}

export const mailerHooks = {
  around: {},
  before: { all: [disallow('external')] },
  after: {},
  error: {},
}
