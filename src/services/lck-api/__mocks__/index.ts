/**
 * by updating storybook config,
 * we have the dataURI of this file
 */
import logo from '../../../../public/themes/locokit/img/thumbnail_logokit-grayscale.png'

export { lckClient } from './client'
export { lckServices } from './services'

export const lckHelpers = {
  exportTableRowData: '123',
  getColumnDisplayValue: '234',
  searchItems: () => '456',
  async getAttachmentBlob (url: string) {
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
  },
  exportTableRowDataXLS: jest.fn(),
  exportTableRowDataCSV: jest.fn(),
  downloadAttachment: jest.fn(),
  uploadMultipleFiles: jest.fn(),
  retrieveWorkspaceWithChaptersAndPages: jest.fn(),
  retrieveTableViewData: jest.fn(),
  retrieveViewData: jest.fn(),
  retrieveViewDefinition: jest.fn(),
  retrievePageWithContainersAndBlocks: jest.fn()
}
