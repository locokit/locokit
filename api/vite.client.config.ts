import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig(() => {
  return {
    publicDir: false,
    build: {
      minify: false,
      sourcemap: true,
      outDir: '../packages/sdk/dist',
      lib: {
        entry: {
          client: 'src/client.ts',
        },
        name: '@locokit/sdk',
        formats: ['cjs', 'es'],
        fileName(format, entry) {
          switch (format) {
            case 'es':
              return entry + '.mjs'
            case 'cjs':
            default:
              return entry + '.cjs'
          }
        },
      },
      rollupOptions: {
        external: Object.keys(pkg.dependencies),
      },
      target: 'node18',
    },
    plugins: [
      tsconfigPaths({
        root: './',
      }),
      dts({
        insertTypesEntry: true,
      }),
    ],
  }
})
