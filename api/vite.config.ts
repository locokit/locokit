import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'
import pkg from './package.json'
import glob from 'glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const sleep = async (s) => await new Promise((r) => setTimeout(r, (s * 1e3) | 0))
const delayedError = async (e) => {
  await sleep(0.1)
  console.error(e)
}

function feathers(Opts = {} as any) {
  const env = loadEnv('', process.cwd())
  const sm = {
    active: true,
    entryFile: Opts.app || 'server/app.ts',
    root: '',
    host: 'localhost',
    port: Opts.port || 23030,
    appListener: void 0,
    feathersApp: void 0,
    config: void 0,
  }
  sm.entryFile = resolve(sm.entryFile)
  sm.root = new globalThis.URL('.', 'file://' + sm.entryFile).pathname
  if (env.VITE_FV_SSG === 'off') {
    sm.active = false
  }
  return {
    name: 'feathers-vite',
    configResolved(config) {
      if (config.command === 'build') {
        sm.active = false
      } else {
        sm.config = config
      }
      if (config.server && config.define?.['import.meta.env.VITE_FV_DEV_USER'] === void 0) {
        const VP = config.server.port || 5173
        config.define ||= {}
        const socketUrl =
          config.mode === 'production'
            ? 'globalThis.location'
            : `globalThis.location.origin.replace('--${VP}', '--${sm.port}').replace(':${VP}', ':${sm.port}')`
        config.define['import.meta.env.SOCKET_URL'] = socketUrl
        config.define['import.meta.env.VITE_FV_URL'] = socketUrl
        if (globalThis.process) {
          globalThis.process.env.VITE_FV_URL = socketUrl
        }
      }
    },
    async configureServer(server) {
      if (!sm.active) {
        return
      }
      return async () => {
        try {
          sm.feathersApp = await (await server.ssrLoadModule(sm.entryFile)).main()
          sm.appListener = await sm.feathersApp.listen(sm.port)
          console.info(`Whoot whoot !! LocoKit started and moving on http://${sm.host}:${sm.port}`)
        } catch (e) {
          server.ssrFixStacktrace(e)
          console.error(e)
        }
      }
    },
    closeBundle() {
      if (sm.appListener) sm.appListener.close()
    },
    async handleHotUpdate({ file, server }) {
      try {
        if (!file.startsWith(sm.root) || !sm.active || sm.appListener === void 0) {
          return
        }
        sm.appListener.close()
        sm.loadResult = void 0
        sm.loadResult = await server.ssrLoadModule(sm.entryFile)
        if (sm.loadResult === void 0) {
          return
        }
        sm.feathersApp = await sm.loadResult.main()
        sm.appListener = await sm.feathersApp.listen(sm.port)
      } catch (e) {
        server.ssrFixStacktrace(e)
        delayedError(e)
      }
    },
  }
}

export default defineConfig(() => {
  return {
    publicDir: false,
    build: {
      outDir: 'dist',
      sourcemap: true,
      lib: {
        entry: {
          index: 'src/index.ts',
          knexfile: 'knexfile.ts',
          'config/default': 'config/default.ts',
          /**
           * Compile migrations files
           */
          ...Object.fromEntries(
            glob.sync('migrations/**/*.ts').map((f: string) => [f.replace('.ts', ''), f]),
          ),
          /**
           * Seed files
           */
          ...Object.fromEntries(
            glob.sync('seeds/**/*.ts').map((f: string) => [f.replace('.ts', ''), f]),
          ),
        },
        name: 'locokitapi',
        formats: ['cjs'],
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
      feathers({ app: 'src/app.ts', port: 3030 }),
      viteStaticCopy({
        targets: [
          {
            src: 'templates',
            dest: '',
          },
          {
            src: 'public',
            dest: '',
          },
          {
            src: 'migrations/functions/*.sql',
            dest: 'migrations/functions',
          },
          {
            src: 'config/*.json',
            dest: 'config',
          },
        ],
      }),
    ],
  }
})
