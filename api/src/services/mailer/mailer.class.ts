import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from 'nodemailer'

import { disallow } from 'feathers-hooks-common'
import SMTPConnection from 'nodemailer/lib/smtp-connection'

export class MailerService {
  transporter: Transporter

  constructor(options: SMTPConnection.Options, defaults: { from?: string }) {
    if (!options)
      throw new Error('mailer service: constructor `options` must be provided')

    this.transporter = nodemailer.createTransport(options, defaults)
  }

  async create(data: Partial<SendMailOptions>): Promise<SentMessageInfo> {
    return await this.transporter.sendMail(data)
  }
}

export const mailerHooks = {
  around: {},
  before: { all: [disallow('external')] },
  after: {},
  error: {},
}
