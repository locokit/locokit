import { fileURLToPath } from 'node:url'
import { defineNuxtModule, addComponentsDir, installModule, addPlugin, createResolver, useModuleContainer } from '@nuxt/kit'
import { Nuxt, NuxtOptions, NuxtPage, ModuleContainer } from '@nuxt/schema'
import { ROUTES } from './pages/paths'
import { getAuthPages, getBackofficePages, getFrontofficePages, getUserPages } from './routes'

const { resolve } = createResolver(import.meta.url)

export interface ModuleOptions {
  submodules: {
    backoffice: {
      enabled: boolean
      prefix: string
    }
    frontoffice: {
      enabled: boolean
      prefix: string
    }
    auth: {
      enabled: boolean
      prefix: string
      redirectUserAfterLogin: string
    }
    user: {
      enabled: boolean
      prefix: string
    }
    admin: {
      enabled: boolean
      prefix: string
    }
  }
  api: {
    url: string
  }
  theme: {
    colors: {
      primary: string
      secondary: string
    }
  }
  extends: {
    layouts: [{
      name: string
      component: string
    }]
    pages: {
      home: {
        layout: string
      }
    }
  }
}
const defaultOptions: ModuleOptions = {
  submodules: {
    backoffice: {
      enabled: true,
      prefix: '',
    },
    frontoffice: {
      enabled: true,
      prefix: '',
    },
    auth: {
      enabled: true,
      prefix: '',
      redirectUserAfterLogin: ROUTES.WORKSPACE.HOME,
    },
    user: {
      enabled: true,
      prefix: '',
    },
    admin: {
      enabled: true,
      prefix: '',
    },
  },
  api: {
    url: 'http://localhost:3030',
  },
  theme: {
    colors: {
      primary: 'red',
      secondary: 'yellow',
    },
  },
  extends: {
    layouts: [{
      name: 'pouet',
      component: 'pouic',
    }],
    pages: {
      home: {
        layout: 'pouet',
      },
    },
  },
}

export type NuxtLocokit = Nuxt & { options: NuxtOptions & { locokit: ModuleOptions }}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-locokit',
    configKey: 'locokit',
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '^3.0.0-rc.9',
    },
  },
  defaults: defaultOptions,
  async setup (options, nuxt) {
    console.log('[nuxt-module] setup...')
    const componentsDir = fileURLToPath(
      new URL('../src/components', import.meta.url),
    )
    const runtimeDir = fileURLToPath(new URL('../src/runtime', import.meta.url))
    const pluginsDir = fileURLToPath(new URL('../src/plugins', import.meta.url))
    await installModule('@nuxtjs/tailwindcss', {
      configPath: resolve(runtimeDir, 'tailwind.config'),
    })
    await installModule('@pinia/nuxt')

    console.log('[nuxt-module]', import.meta.url)

    nuxt.options.build.transpile.push(runtimeDir)

    // addPlugin(resolve(runtimeDir, 'tailwind.config'))
    addPlugin(resolve(pluginsDir, 'primevue'))
    // addPlugin(resolve(pluginsDir, 'locokit'))
    addPlugin(resolve(pluginsDir, 'i18n'))
    addPlugin(resolve(pluginsDir, 'middlewares'))

    console.log('[nuxt-module]', resolve(componentsDir))
    await addComponentsDir({
      path: resolve(componentsDir),
      prefix: 'lck-',
    })

    /**
     * Register all layouts
     */
    /**
     * Add local styles
     */
    nuxt.options.css = nuxt.options.css ?? []
    nuxt.options.css.push('primevue/resources/themes/tailwind-light/theme.css')
    nuxt.options.css.push('primevue/resources/primevue.css')
    nuxt.options.css.push('primeicons/primeicons.css')
    nuxt.options.css.push(resolve(__dirname, '../src/styles/theme.css'))
    nuxt.options.css.push(resolve(__dirname, '../src/styles/index.scss'))
    nuxt.options.css.push(resolve(__dirname, '../src/index.css'))

    nuxt.options.build.transpile.push('primevue')

    console.log('[nuxt-locokit][plugin-locokit] Registering components...')

    const layoutsDir = fileURLToPath(new URL('../src/layouts', import.meta.url))
    const pagesDir = fileURLToPath(new URL('../src/pages', import.meta.url))

    // for (const name in components) {
    //   console.log('[nuxt-locokit][plugin-locokit] Registering component ' + name + '...')
    //   nuxt.vueApp.component(name, {
    //     // extend the original component
    //     extends: components[name],
    //   })
    // }

    const module: ModuleContainer = useModuleContainer()

    console.log('[nuxt-module]', nuxt.options.layouts)

    module.addLayout({
      src: resolve(layoutsDir, './with-background.vue'),
    }, 'with-background')

    module.extendRoutes(function (pages: NuxtPage[]) {
      // console.log('extending routes', pages)
      const { submodules, api, theme } = options
      // console.log(submodules, api, theme)

      pages.push({
        name: 'home',
        path: '/',
        file: resolve(pagesDir, './index.vue'),
        meta: {
          needAuthentification: false,
        },
      })

      /**
         * Register auth pages
         */
      if (submodules.auth.enabled) {
        const prefix = submodules.auth.prefix
        pages.push(...getAuthPages(prefix))
      }

      /**
         * Register user pages
         */
      if (submodules.user.enabled) {
        const prefix = submodules.user.prefix
        pages.push(...getUserPages(prefix))
      }

      /**
         * Register workspace pages
         */
      pages.push({
        name: ROUTES.WORKSPACE.HOME,
        path: ROUTES.WORKSPACE.HOME,
        file: resolve(pagesDir, './w/index.vue'),
      })
      pages.push({
        name: ROUTES.WORKSPACE.DETAIL,
        path: ROUTES.WORKSPACE.DETAIL,
        file: resolve(pagesDir, './w/[w].vue'),
      })

      /**
         * Register back office pages
         */
      if (submodules.backoffice.enabled) {
        const prefix = submodules.backoffice.prefix
        pages.push(...getBackofficePages(prefix))
      }

      /**
         * Register front office pages
         */
      if (submodules.frontoffice.enabled) {
        const prefix = submodules.frontoffice.prefix
        pages.push(...getFrontofficePages(prefix))
      }
    })
    console.log('[nuxt-locokit][plugin-locokit] Registering components ok.')

    console.log('[nuxt-module] setup ok.')
  },
})
