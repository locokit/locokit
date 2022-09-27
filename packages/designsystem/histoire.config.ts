import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import './src/index.css'

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
        include: file => /Code gen|Controls|Docs/.test(file.title),
      },
      {
        title: 'Components',
        include: file => !file.title.includes('Serialize'),
      },
      {
        title: 'Layouts',
        include: file => !file.title.includes('Serialize'),
      },
      {
        title: 'Others',
        include: file => true,
      },
    ],
  },
  plugins: [
    HstVue(),
  ],
  setupFile: './histoire.setup.ts',
})
