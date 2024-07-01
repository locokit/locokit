import { disallow } from 'feathers-hooks-common'

import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'
import { SmtpOptions } from 'nodemailer-smtp-transport'

export class MailerService {
  transporter: Transporter

  constructor(options: SmtpOptions) {
    this.transporter = nodemailer.createTransport(options)
  }

  async create(data: Partial<SendMailOptions>): Promise<SentMessageInfo> {
    return await new Promise((resolve) => {
      console.log(
        `[MAIL] A new mail need to be sent to ${data.to as string} from ${data.from as string}`,
      )
      resolve('ok')
    })
  }
}

export const mailerHooks = {
  around: {},
  before: { all: [disallow('external')] },
  after: {},
  error: {},
}
