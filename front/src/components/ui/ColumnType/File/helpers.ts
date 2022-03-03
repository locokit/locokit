import { LckAttachment } from '@/services/lck-api/definitions'

export function getAttachmentsToDisplay (attachments: LckAttachment[], workspaceId: string) {
  if (!attachments || attachments.length === 0) return []
  return attachments?.map(a => {
    const displayData = {
      ...a,
      class: 'bi bi-file-earmark',
      element: 'span',
      url: `${LCK_SETTINGS.STORAGE_URL}/${workspaceId}/${a.filename}`,
      thumbnailURL: `${LCK_SETTINGS.STORAGE_URL}/${workspaceId}/thumbnail_${a.filename}`,
    }
    switch (a.mime) {
      case 'image/png':
      case 'image/jpeg':
        if (a.thumbnail) {
          displayData.element = 'img'
          displayData.class = ''
        } else {
          displayData.class = 'bi bi-file-image'
        }
        break
      case 'application/pdf':
        displayData.class = 'bi bi-file-earmark-pdf'
        break
      case 'application/vnd.oasis.opendocument.text':
        displayData.class = 'bi bi-file-earmark-text'
        break
      case 'application/vnd.oasis.opendocument.spreadsheet':
        displayData.class = 'bi bi-file-earmark-spreadsheet'
        break
    }
    return displayData
  })
}
