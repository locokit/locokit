import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  theme: {
    title: 'LocoKit',
    logoHref: 'https://locokit.io',
    favicon: './favicon.ico',
  },
  tree: {
    groups: [
      {
        id: 'top',
        title: '', // No toggle
      },
      {
        title: 'My Group',
        include: (file) => /Code gen|Controls|Docs/.test(file.title),
      },
      {
        title: 'Components',
        include: (file) => !file.title.includes('Serialize'),
      },
      {
        title: 'Layouts',
        include: (file) => !file.title.includes('Serialize'),
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
