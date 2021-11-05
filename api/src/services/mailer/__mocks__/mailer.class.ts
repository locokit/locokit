// import { Service } from 'feathers-objection'
import { Application } from '../../../declarations'
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

  async create (data: Partial<SendMailOptions>, params?: Params | undefined): Promise<SentMessageInfo> {
    return await new Promise((resolve, reject) => {
      console.log(`[MAIL] A new mail need to be sent to ${data.to as string} from ${data.from as string || this.app.get('mail') as string}`)
      resolve('ok')
    })
  }
}

// // Import this named export into your test file:
// export const mockPlaySoundFile = jest.fn();
// const mock = jest.fn().mockImplementation(() => {
//   return {playSoundFile: mockPlaySoundFile};
// });

// export default mock;
