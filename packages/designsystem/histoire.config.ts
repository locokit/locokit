import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

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
  ],
  setupFile: './src/histoire.setup.ts',
  storyIgnored: ['**/node_modules/**', '**/dist/**', '**/test/**'],
})
