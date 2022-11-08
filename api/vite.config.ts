// vite.config.ts
// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import { feathers } from 'feathers-vite'

export default defineConfig(() => {
  return {
    plugins: [feathers({ app: 'src/app.ts', port: 3030 })],
    build: { target: 'esnext' },
  }
})
