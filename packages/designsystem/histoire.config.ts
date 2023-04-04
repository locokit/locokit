import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { HstScreenshot } from '@histoire/plugin-screenshot'

export default defineConfig({
  theme: {
    title: 'LocoKit',
    logoHref: 'https://locokit.io',
  },
  tree: {
    groups: [
      {
        title: 'Components',
        include: (file) => file.path.includes('stories'),
      },
    ],
  },
  plugins: [
    HstVue(),
    HstScreenshot({
      ignored: ({ file }) => {
        return file.includes('tailwind') || file.includes('test')
      },
    }),
  ],
  setupFile: './src/histoire.setup.ts',
  storyIgnored: ['**/node_modules/**', '**/dist/**', '**/test/**'],
})
