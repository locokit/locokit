export { lckClient } from './client'
export { lckServices } from './services'
export const lckHelpers = {
  exportTableRowData: '123',
  getColumnDisplayValue: '234',
  searchItems: () => '456',
  async getAttachmentBlob (url: string) {
    if (url === 'bad-src') throw new Error('bad src')
    const response = await fetch('/themes/locokit/img/logokit-grayscale.png')
    if (url === 'wait-some-time') {
      return new Promise(resolve => {
        setTimeout(async () => resolve(await response.blob()), 2000)
      })
    }

    // Create an object URL from the data.
    return await response.blob()
  }
}
