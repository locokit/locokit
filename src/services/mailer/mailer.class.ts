// import { Service } from 'feathers-objection'
import { Application } from '../../declarations'
import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import { Params } from '@feathersjs/feathers'

export class Mailer {
  transporter: Transporter
  defaultFrom: string

  constructor (options: SmtpOptions, app: Application) {
    this.transporter = nodemailer.createTransport(options)
    this.defaultFrom = app.get('mail').from
  }

  async create (data: Partial<SendMailOptions>, params?: Params | undefined): Promise<SentMessageInfo> {
    return await this.transporter.sendMail({
      from: this.defaultFrom,
      ...data,
    })
  }
}
