import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'


export default defineConfig(() => {
  return {
    build: {
      sourcemap: true,
      lib: {
        name: '@locokit/engine',
        entry: ['src/index.ts'],
        formats: ['cjs', 'es', 'umd'],
      },
      rollupOptions: {
        external: Object.keys(pkg.dependencies),
      },
      target: 'node18',
    },
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
  }
})
