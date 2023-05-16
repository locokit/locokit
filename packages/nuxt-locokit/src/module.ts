/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import {
  addLayout,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendPages,
  installModule,
} from '@nuxt/kit'
import { Nuxt, NuxtOptions, NuxtPage } from '@nuxt/schema'
import { ROUTES_NAMES, ROUTES_PATH } from './paths'
import { getAuthPages } from './routes'

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
      redirectUserAfterLogin: ROUTES_PATH.WORKSPACE.WORKSPACES,
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
      nuxt: '^3.0.0',
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
    addPlugin(resolve(pluginsDir, 'middlewares'))
    addPlugin(resolve(pluginsDir, 'primevue'))
    // addPlugin(resolve(pluginsDir, 'locokit'))
    addPlugin(resolve(pluginsDir, 'i18n'))
    addPlugin(resolve(pluginsDir, 'vee-validate'))
    addPlugin(resolve(pluginsDir, 'directive'))

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
    nuxt.options.css.push('bootstrap-icons/font/bootstrap-icons.css')
    nuxt.options.css.push(resolve(__dirname, '../src/styles/index.scss'))
    nuxt.options.css.push(resolve(__dirname, '../src/styles/global.scss'))
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

    addLayout(
      {
        src: resolve(layoutsDir, './WithHeader.vue'),
      },
      'WithHeader',
    )
    addLayout(
      {
        src: resolve(layoutsDir, './WithAsideNav.vue'),
      },
      'WithAsideNav',
    )
    // addLayout(
    //   {
    //     src: resolve(layoutsDir, './WithBackground.vue'),
    //   },
    //   'WithBackground',
    // )
    addLayout(
      {
        src: resolve(layoutsDir, './WithSidebar.vue'),
      },
      'WithSidebar',
    )

    extendPages(function (pages: NuxtPage[]) {
      const { submodules } = options

      /**
       * Register workspace page
       */
      pages.push({
        name: ROUTES_NAMES.WORKSPACE.HOME,
        path: ROUTES_PATH.WORKSPACE.HOME,
        meta: {
          protected: true,
        },
        file: resolve(pagesDir, './workspace/index.vue'),
        // redirect: ROUTES_PATH.WORKSPACE.DASHBOARD,
        children: [
          {
            name: ROUTES_NAMES.WORKSPACE.DASHBOARD,
            path: ROUTES_PATH.WORKSPACE.DASHBOARD,
            meta: {
              protected: true,
            },
            file: resolve(
              pagesDir,
              './workspace/DashboardPage/DashboardPage.vue',
            ),
          },
          {
            name: ROUTES_NAMES.WORKSPACE.DATASOURCE.HOME,
            path: ROUTES_PATH.WORKSPACE.DATASOURCE.HOME,
            meta: {
              protected: true,
            },
            file: resolve(pagesDir, './workspace/datasource/index.vue'),
            // redirect: ROUTES_PATH.WORKSPACE.DATABASE.ABOUT,
            children: [
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.ABOUT,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.ABOUT,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './workspace/datasource/AboutDatasource/AboutDatasource.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.CREATE,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './workspace/datasource/CreateDatasource/CreateDatasource.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.SCHEMA,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.SCHEMA,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './workspace/datasource/SchemaDatasource/SchemaDatasource.vue',
                ),
              },
            ],
          },
          {
            name: ROUTES_NAMES.WORKSPACE.SETTINGS,
            path: ROUTES_PATH.WORKSPACE.SETTINGS,
            meta: {
              protected: true,
            },
            file: resolve(
              pagesDir,
              './workspace/SettingsPage/SettingsPage.vue',
            ),
          },
        ],
      })

      /**
       * Register admin pages
       */
      pages.push({
        name: ROUTES_NAMES.ADMIN.HOME,
        path: ROUTES_PATH.ADMIN.HOME,
        meta: {
          protected: true,
        },
        file: resolve(pagesDir, './admin/index.vue'),
        redirect: ROUTES_PATH.ADMIN.USERS.HOME,
        children: [
          {
            name: ROUTES_NAMES.ADMIN.USERS.HOME,
            path: ROUTES_PATH.ADMIN.USERS.HOME,
            meta: {
              protected: true,
            },
            file: resolve(pagesDir, './admin/users/index.vue'),
            redirect: ROUTES_PATH.ADMIN.USERS.ABOUT,
            children: [
              {
                name: ROUTES_NAMES.ADMIN.USERS.ABOUT,
                path: ROUTES_PATH.ADMIN.USERS.ABOUT,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './admin/users/AboutUsers/AboutUsers.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.USERS.CREATE,
                path: ROUTES_PATH.ADMIN.USERS.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './admin/users/CreateUser/CreateUser.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.USERS.RECORD,
                path: ROUTES_PATH.ADMIN.USERS.RECORD,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './admin/users/RecordUser/RecordUser.vue',
                ),
              },
            ],
          },
          {
            name: ROUTES_NAMES.ADMIN.GROUPS.HOME,
            path: ROUTES_PATH.ADMIN.GROUPS.HOME,
            meta: {
              protected: true,
            },
            file: resolve(pagesDir, './admin/groups/index.vue'),
            redirect: ROUTES_PATH.ADMIN.GROUPS.ABOUT,
            children: [
              {
                name: ROUTES_NAMES.ADMIN.GROUPS.ABOUT,
                path: ROUTES_PATH.ADMIN.GROUPS.ABOUT,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './admin/groups/AboutGroups/AboutGroups.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.GROUPS.CREATE,
                path: ROUTES_PATH.ADMIN.GROUPS.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './admin/groups/CreateGroup/CreateGroup.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.GROUPS.RECORD,
                path: ROUTES_PATH.ADMIN.GROUPS.RECORD,
                meta: {
                  protected: true,
                },
                file: resolve(
                  pagesDir,
                  './admin/groups/RecordGroup/RecordGroup.vue',
                ),
              },
            ],
          },
        ],
      })

      /**
       * Register profile pages
       */
      pages.push({
        name: ROUTES_NAMES.PROFILE.HOME,
        path: ROUTES_PATH.PROFILE.HOME,
        meta: {
          protected: true,
        },
        file: resolve(pagesDir, './profile/index.vue'),
        redirect: ROUTES_PATH.PROFILE.UPDATE_GENERAL,
        children: [
          {
            name: ROUTES_NAMES.PROFILE.UPDATE_GENERAL,
            path: ROUTES_PATH.PROFILE.UPDATE_GENERAL,
            meta: {
              protected: true,
            },
            file: resolve(
              pagesDir,
              './profile/UpdateGeneral/UpdateGeneral.vue',
            ),
          },
          {
            name: ROUTES_NAMES.PROFILE.UPDATE_EMAIL,
            path: ROUTES_PATH.PROFILE.UPDATE_EMAIL,
            meta: {
              protected: true,
            },
            file: resolve(pagesDir, './profile/UpdateEmail/UpdateEmail.vue'),
          },
          {
            name: ROUTES_NAMES.PROFILE.UPDATE_PASSWORD,
            path: ROUTES_PATH.PROFILE.UPDATE_PASSWORD,
            meta: {
              protected: true,
            },
            file: resolve(
              pagesDir,
              './profile/UpdatePassword/UpdatePassword.vue',
            ),
          },
        ],
      })

      /**
       * Register workspaces page
       */
      pages.push({
        name: ROUTES_NAMES.WORKSPACE.WORKSPACES,
        path: ROUTES_PATH.WORKSPACE.WORKSPACES,
        meta: {
          protected: false,
          anonymous: false,
        },
        file: resolve(pagesDir, './WorkspacesList/WorkspacesList.vue'),
      })

      /**
       * Register create a workspace page
       */
      pages.push({
        name: ROUTES_NAMES.WORKSPACE.CREATE_WORKSPACE,
        path: ROUTES_PATH.WORKSPACE.CREATE_WORKSPACE,
        meta: {
          protected: true,
          anonymous: false,
        },
        file: resolve(pagesDir, './CreateWorkspace/CreateWorkspace.vue'),
      })

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
