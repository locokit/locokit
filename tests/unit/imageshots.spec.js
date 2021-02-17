import path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
import expect from 'expect'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')

const getMatchOptions = () => {
  return {
    failureThreshold: 0.01,
    failureThresholdType: 'percent'
  }
}

initStoryshots({
  framework: 'vue',
  suite: 'storyshots-puppeteer',
  configPath: path.join(__dirname, '../../.storybook'),
  test: imageSnapshot({
    getMatchOptions,
    async beforeScreenshot (page, { context: { args }, url }) {
      /**
       * if there is a special "property" named timeoutBeforeScreenshot
       * we wait this time and resolve it
       */
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Taking screenshot for url ', url, 'with args ', args)
          page.setViewport({ width: 1024, height: 768 })
          resolve()
        }, args.timeoutBeforeScreenshot || 0)
      })
    },
    storybookUrl: process.env.CI ? `file:///${path.resolve(__dirname, '../../storybook-static')}` : 'http://localhost:6006'
  })
})

// https://github.com/americanexpress/jest-image-snapshot#optional-configuration
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: { threshold: 0 }
})

expect.extend({ toMatchImageSnapshot })
