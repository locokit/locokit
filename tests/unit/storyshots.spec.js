import path from 'path'
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots'

initStoryshots({
  framework: 'vue',
  suite: 'storyshots',
  configPath: path.join(__dirname, '../../.storybook'),
  // integrityOptions: { cwd: path.resolve(__dirname, '../../src/') },
  test: multiSnapshotWithOptions()
})
