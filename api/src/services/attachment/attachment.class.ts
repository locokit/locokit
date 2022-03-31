import { NullableId, Params } from '@feathersjs/feathers'
import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
import { LckAttachment } from '../../models/attachment.model'
import { removeAttachmentOfRows } from '../row/row.helpers'
import { removeUploadFromAttachment } from '../upload/upload.helpers'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class Attachment extends Service {
  app: Application

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options

    super({
      ...otherOptions,
      model: Model,
    })

    this.app = app
  }

  async remove (id: NullableId, params?: Params): Promise<LckAttachment | LckAttachment[]> {
    if (id) {
      /**
       * Retrieve the attachment,
       */
      const attachment: LckAttachment = await this._get(id)

      /**
       * Remove the object in the storage (S3 / FS)
       */
      await removeUploadFromAttachment(attachment)

      /**
       * And remove all related records referencing this attachment
       */
      await removeAttachmentOfRows(attachment)
    } else {
      /**
       * multi removal ?
       */
      throw new Error('You cannot remove several attachment in the same time. This feature is not yet implemented.')
    }
    return super.remove(id, params)
  }
}
