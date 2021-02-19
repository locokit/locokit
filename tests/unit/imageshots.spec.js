import path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
import { formatISO } from 'date-fns'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { toMatchImageSnapshot } = require('jest-image-snapshot')

const getMatchOptions = () => {
  return {
    comparisonMethod: 'ssim',
    failureThreshold: 0.02,
    failureThresholdType: 'percent'
  }
}

initStoryshots({
  framework: 'vue',
  suite: 'storyshots-puppeteer',
  configPath: path.join(__dirname, '../../.storybook'),
  test: imageSnapshot({
    getMatchOptions,
    /**
     * To match imageshots, we use two abilities :
     * * wire ourselves beforeScreenshot
     * * use the waitForSelector of puppeteer (https://pptr.dev/#?product=Puppeteer&version=v7.1.0&show=api-pagewaitforselectorselector-options)
     * This help us to take the screenshot when the page is "really" ready.
     */
    async beforeScreenshot (page, { context: { args }, url }) {
      const imageShotName = './' + url.replace('http://localhost:6006/iframe.html?id=', '')
      console.log(formatISO(Date.now()), 'screenshot for ', imageShotName, args)
      await page.setViewport({ width: 1024, height: 768 })
      // await page._client.send('Animation.setPlaybackRate', { playbackRate: 10 })
      /**
       * if there is a special "property" named waitForSelector
       * we wait for the apparition of this element, we wait a little and continue
       */
      if (args?.waitForSelector) {
        console.log('waiting for ', args.waitForSelector)
        // await page.$(args.waitForSelector)
        await page.waitForSelector(args.waitForSelector)
        await page.waitForTimeout(500)
      }
    },
    storybookUrl: process.env.CI ? `file:///${path.resolve(__dirname, '../../storybook-static')}` : 'http://localhost:6006'
    // storybookUrl: `file:///${path.resolve(__dirname, '../../storybook-static')}`
  })
})

expect.extend({ toMatchImageSnapshot })
