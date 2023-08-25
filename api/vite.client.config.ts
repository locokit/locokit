import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig(() => {
  return {
    publicDir: false,
    build: {
      sourcemap: true,
      outDir: '../packages/sdk/dist',
      lib: {
        entry: {
          client: 'src/client.ts',
        },
        name: '@locokit/sdk',
        formats: ['cjs', 'es', 'umd'],
        fileName: (format: string, entry: string) => `${entry}.${format}.js`,
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
