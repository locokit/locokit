// import { Service } from 'feathers-objection'
import { Application } from '../../declarations'
import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import { Params } from '@feathersjs/feathers'

export class Mailer {
  transporter: Transporter
  app: Application

  constructor (options: SmtpOptions, app: Application) {
    this.transporter = nodemailer.createTransport(options)
    this.app = app
  }

  create (data: Partial<SendMailOptions>, params?: Params | undefined): Promise<SentMessageInfo> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({
        from: this.app.get('mail').from,
        ...data
      }, (error, info) => {
        if (error) reject(error)
        resolve(info)
      })
    })
  }
}
