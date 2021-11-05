/* eslint-disable @typescript-eslint/camelcase */
import logo from '../../../../public/themes/locokit/img/logo.png'
import { lckServices } from './services'

export const searchItems = () => '456'
export const getColumnDisplayValue = '234'
export async function getAttachmentBlob (url: string) {
  if (url === 'bad-src') throw new Error('bad src')

  // here we use fetch to transform datauri to an object blobifiable
  const response = await fetch(logo)

  if (url === 'wait-some-time') {
    return new Promise(resolve => {
      setTimeout(async () => resolve(await response.blob()), 2000)
    })
  }

  // Create an object URL from the data.
  return await response.blob()
}
export const exportTableRowDataXLS = () => ({})
export const exportTableRowDataCSV = () => ({})
export const downloadAttachment = () => ({})
export const uploadMultipleFiles = () => ({})
export const retrieveWorkspaceWithChaptersAndPages = () => ({})
export const retrieveTableViewData = () => ({})
export const retrieveViewData = () => ({})
export const retrieveViewDefinition = () => ({})

export async function retrievePageWithContainersAndBlocks (id: string) {
  return await lckServices.page.get(id, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: { $eager: 'containers.[blocks]' },
  })
}
export default {
  searchItems,
  exportTableRowDataXLS,
  exportTableRowDataCSV,
  getColumnDisplayValue,
  downloadAttachment,
  getAttachmentBlob,
  uploadMultipleFiles,
  retrieveWorkspaceWithChaptersAndPages,
  retrieveTableViewData,
  retrieveViewData,
  retrieveViewDefinition,
  retrievePageWithContainersAndBlocks,
}
