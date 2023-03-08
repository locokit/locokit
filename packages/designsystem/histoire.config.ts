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
      {
        title: 'Others',
        include: (file) => true,
      },
    ],
  },
  plugins: [HstVue()],
  setupFile: './src/histoire.setup.ts',
})
