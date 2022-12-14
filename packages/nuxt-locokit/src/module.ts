/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import {
  defineNuxtModule,
  // addComponentsDir,
  installModule,
  addPlugin,
  createResolver,
  addTemplate,
  addLayout,
  extendPages,
} from '@nuxt/kit'
import { Nuxt, NuxtOptions, NuxtPage } from '@nuxt/schema'
import { ROUTES_NAMES, ROUTES_PATH } from './paths'
import {
  getAuthPages,
  // getBackofficePages,
  // getFrontofficePages,
  // getUserPages,
} from './routes'

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
      redirectUserAfterLogin: ROUTES_PATH.WORKSPACE.HOME,
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
}

export type NuxtLocokit = Nuxt & {
  options: NuxtOptions & { locokit: ModuleOptions }
}

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
  async setup(options, nuxt) {
    console.log('[nuxt-module] setup...')
    // const componentsDir = fileURLToPath(
    //   new URL('../src/components', import.meta.url),
    // )
    const runtimeDir = fileURLToPath(new URL('../src/runtime', import.meta.url))
    const pluginsDir = fileURLToPath(new URL('../src/plugins', import.meta.url))
    await installModule('@nuxtjs/tailwindcss', {
      configPath: resolve(runtimeDir, 'tailwind.config'),
    })
    await installModule('@pinia/nuxt')
    // nuxt.options.build.transpile.push(runtimeDir)

    // addPlugin(resolve(runtimeDir, 'tailwind.config'))
    addPlugin(resolve(pluginsDir, 'primevue'))
    // addPlugin(resolve(pluginsDir, 'locokit'))
    addPlugin(resolve(pluginsDir, 'i18n'))
    addPlugin(resolve(pluginsDir, 'vee-validate'))
    addPlugin(resolve(pluginsDir, 'directive'))
    addPlugin(resolve(pluginsDir, 'middlewares'))

    // await addComponentsDir({
    //   path: resolve(componentsDir),
    //   prefix: 'lck-',
    // })

    /**
     * Register all layouts
     */
    /**
     * Add local styles
     */
    nuxt.options.css = nuxt.options.css ?? []
    nuxt.options.css.push('primevue/resources/primevue.css')
    nuxt.options.css.push('primeicons/primeicons.css')
    nuxt.options.css.push(resolve(__dirname, '../src/styles/index.scss'))
    nuxt.options.css.push(resolve(__dirname, '../src/styles/theme.css'))

    //
    nuxt.options.build.transpile.push('primevue')
    //
    // console.log('[nuxt-locokit][plugin-locokit] Registering components...')

    const layoutsDir = fileURLToPath(new URL('../src/layouts', import.meta.url))
    const pagesDir = fileURLToPath(new URL('../src/pages', import.meta.url))

    // for (const name in components) {
    //   console.log('[nuxt-locokit][plugin-locokit] Registering component ' + name + '...')
    //   nuxt.vueApp.component(name, {
    //     // extend the original component
    //     extends: components[name],
    //   })
    // }

    // module.addLayout(
    //   {
    //     src: resolve(layoutsDir, './WithBackground.vue'),
    //   },
    //   'WithBackground',
    // )
    addLayout(
      {
        src: resolve(layoutsDir, './WithBanner.vue'),
      },
      'WithBanner',
    )
    addLayout(
      {
        src: resolve(layoutsDir, './WithAsideNavAndSidebar.vue'),
      },
      'WithAsideNavAndSidebar',
    )
    addLayout(
      {
        src: resolve(layoutsDir, './WithAsideNav.vue'),
      },
      'WithAsideNav',
    )
    addLayout(
      {
        src: resolve(layoutsDir, './WithThinNav.vue'),
      },
      'WithThinNav',
    )
    addLayout(
      {
        src: resolve(layoutsDir, './WithThinNavAndSidebar.vue'),
      },
      'WithThinNav',
    )
    // module.addLayout(
    //   {
    //     src: resolve(layoutsDir, './WithTwoSide.vue'),
    //   },
    //   'WithTwoSide',
    // )
    // const tpl = addTemplate({
    //   src: resolve(layoutsDir, 'WithTwoSide.vue'),
    //   write: true,
    // })
    // module.addLayout(tpl, 'WithTwoSide')
    extendPages(function (pages: NuxtPage[]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { submodules, api } = options

      pages.push({
        name: ROUTES_NAMES.HOME,
        path: ROUTES_PATH.HOME,
        file: resolve(pagesDir, './index.vue'),
        meta: {
          protected: false,
        },
      })

      /**
       * Register auth pages
       */
      if (submodules.auth.enabled) {
        const prefix = submodules.auth.prefix
        pages.push(...getAuthPages(prefix))
      }

      // /**
      //  * Register user pages
      //  */
      // if (submodules.user.enabled) {
      //   const prefix = submodules.user.prefix
      //   pages.push(...getUserPages(prefix))
      // }
      //
      /**
       * Register workspace pages
       */
      pages.push({
        name: ROUTES_NAMES.WORKSPACE.HOME,
        path: ROUTES_PATH.WORKSPACE.HOME,
        meta: {
          protected: false,
          anonymous: false,
        },
        file: resolve(pagesDir, './workspace/index.vue'),
      })

      pages.push({
        name: ROUTES_NAMES.WORKSPACE.CREATE,
        path: ROUTES_PATH.WORKSPACE.CREATE,
        meta: {
          protected: true,
          anonymous: false,
        },
        file: resolve(pagesDir, './workspace/CreateWorkspace.vue'),
      })

      // pages.push({
      //   name: ROUTES.WORKSPACE.DETAIL,
      //   path: ROUTES.WORKSPACE.DETAIL,
      //   file: resolve(pagesDir, './w/bouh[w].vue'),
      // })
      //
      // /**
      //  * Register back office pages
      //  */
      // if (submodules.backoffice.enabled) {
      //   const prefix = submodules.backoffice.prefix
      //   pages.push(...getBackofficePages(prefix))
      // }
      //
      // /**
      //  * Register front office pages
      //  */
      // if (submodules.frontoffice.enabled) {
      //   const prefix = submodules.frontoffice.prefix
      //   pages.push(...getFrontofficePages(prefix))
      // }
    })
    console.log('[nuxt-module] setup ok.')
  },
})
