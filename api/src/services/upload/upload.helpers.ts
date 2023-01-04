import { LckAttachment } from '../../models/attachment.model'
import app from '../../app'

/**
 * Remove upload in storage (S3/file system)
 * from an attachment (filename).
 *
 * Remove thumbnail if needed.
 */
export async function removeUploadFromAttachment (attachment: LckAttachment): Promise<void> {
  await app.service('upload').remove(attachment.filename, {
    query: {
      workspace_id: attachment.workspace_id,
    },
  })

  if (attachment.thumbnail) {
    await app.service('upload').remove('thumbnail_' + attachment.filename, {
      query: {
        workspace_id: attachment.workspace_id,
      },
    })
  }
}
