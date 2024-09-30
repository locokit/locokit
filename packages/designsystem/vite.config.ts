import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig(() => ({
  build: {
    sourcemap: true,
    lib: {
      name: '@locokit/designsystem',
      entry: 'src/index.ts',
      formats: ['cjs', 'es', 'umd'],
      fileName: (format: string, entry: string) => `${entry}.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), /primevue\//],
    },
  },
  plugins: [
    vue(),
  //   dts({
  //     insertTypesEntry: true,
  //   }),
  ],
  server: {
    fs: {
      // Allow serving files from node_module (needed to bootstrap-icon)
      allow: ['../../../'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
}))
