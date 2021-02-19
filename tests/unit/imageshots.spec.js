import path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
// import expect from 'expect'
import { formatISO } from 'date-fns'

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
    updatePassedSnapshot: true,
    beforeScreenshot (page, { context: { args }, url }) {
      page.setViewport({ width: 1024, height: 768 })
      /**
       * if there is a special "property" named timeoutBeforeScreenshot
       * we wait this time and resolve it
       */
      if (args.timeoutBeforeScreenshot) {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(formatISO(Date.now()), 'Taking screenshot for url ', url, 'with args ', args)
            resolve(page)
          // }, args.timeoutBeforeScreenshot || 1000)
          }, 5000)
        })
      }
    },
    storybookUrl: process.env.CI ? `file:///${path.resolve(__dirname, '../../storybook-static')}` : 'http://localhost:6006'
    // storybookUrl: `file:///${path.resolve(__dirname, '../../storybook-static')}`
  })
})

// https://github.com/americanexpress/jest-image-snapshot#optional-configuration
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: { threshold: 0 }
})

expect.extend({ toMatchImageSnapshot })
