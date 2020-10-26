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
      console.log(`[MAIL] A new mail need to be sent to ${data.to} from ${data.from || this.app.get('mail')}`)
      resolve()
    })
  }
}

// // Import this named export into your test file:
// export const mockPlaySoundFile = jest.fn();
// const mock = jest.fn().mockImplementation(() => {
//   return {playSoundFile: mockPlaySoundFile};
// });

// export default mock;
