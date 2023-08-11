import { Application } from '@/declarations'
import { disallow } from 'feathers-hooks-common'

import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import { Params } from '@feathersjs/feathers'

export class MailerService {
  transporter: Transporter

  constructor(options: SmtpOptions, app: Application) {
    this.transporter = nodemailer.createTransport(options)
  }

  async create(
    data: Partial<SendMailOptions>,
    _params?: Params | undefined,
  ): Promise<SentMessageInfo> {
    return await new Promise((resolve, reject) => {
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
