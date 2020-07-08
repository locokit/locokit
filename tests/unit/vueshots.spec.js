import path from 'path'
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
import expect from 'expect'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')

initStoryshots({
  framework: 'vue',
  suite: 'storyshots',
  configPath: path.join(__dirname, '../../.storybook'),
  // integrityOptions: { cwd: path.resolve(__dirname, '../../src/') },
  test: multiSnapshotWithOptions()
})

initStoryshots({
  framework: 'vue',
  suite: 'storyshots-puppeteer',
  configPath: path.join(__dirname, '../../.storybook'),
  test: imageSnapshot({
    beforeScreenshot (page) {
      page.setViewport({ width: 1024, height: 768 })
    },
    storybookUrl: `file:///${path.resolve(__dirname, '../../storybook-static')}`
  })
})

// https://github.com/americanexpress/jest-image-snapshot#optional-configuration
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: { threshold: 0 }
})

expect.extend({ toMatchImageSnapshot })
