/* eslint-disable no-console */
import {
  addPlugin,
  addRouteMiddleware,
  createResolver,
  defineNuxtModule,
  extendPages,
  installModule,
} from '@nuxt/kit'
import type { Nuxt, NuxtOptions, NuxtPage } from '@nuxt/schema'
import en from '@locokit/i18n/en.json' assert { type: 'json' }
import { ROUTES_NAMES, ROUTES_PATH } from './runtime/locokit-paths'

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
  options: NuxtOptions & {
    locokit: ModuleOptions
  }
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
    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('./runtime'))

    console.log('[nuxt-module] setup...')

    const runtimeDir = resolve('./runtime')
    const isDevelopment =
      runtimeDir.endsWith('src/runtime') || runtimeDir.endsWith('src\\runtime')

    const styleExtension = isDevelopment ? 'scss' : 'css'
    await installModule('nuxt-primevue', {
      usePrimeVue: true,
      options: {
        ripple: true,
        // Todo: see locokit/packages/nuxt-locokit/src/runtime/plugins/3_i18n.ts:9
        locale: Object.assign({}, en.localePrime),
      },
      cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
      components: {
        prefix: 'Prime',
        include: '*',
      },
      directives: {
        include: ['Tooltip'],
      },
    })

    await installModule('@nuxtjs/tailwindcss', {
      exposeConfig: true,
      config: {
        content: {
          files: [
            resolve('../**/*.vue'),
            resolve('../../designsystem/src/components/**/*.vue'),
          ],
        },
        theme: {
          extend: {
            colors: {
              primary: 'var(--primary-color)',
              'primary-lighten': 'var(--primary-color-lighten)',
              'primary-light': 'var(--primary-color-light)',
              'primary-dark': 'var(--primary-color-dark)',
              secondary: 'var(--secondary-color)',
              'secondary-lighten': 'var(--secondary-color-lighten)',
              'secondary-light': 'var(--secondary-color-light)',
              'secondary-dark': 'var(--secondary-color-dark)',
              error: 'var(--color-error)',
              'error-lighten': 'var(--color-error-lighten)',
              'error-light': 'var(--color-error-light)',
              'error-dark': 'var(--color-error-dark)',
              success: 'var(--color-success)',
              'success-lighten': 'var(--color-success-lighten)',
              'success-light': 'var(--color-success-light)',
              'success-dark': 'var(--color-success-dark)',
              warning: 'var(--color-warning)',
              'warning-lighten': 'var(--color-warning-lighten)',
              'warning-light': 'var(--color-warning-light)',
              'warning-dark': 'var(--color-warning-dark)',
              lck: 'var(--text-color)',
            },
            borderRadius: {
              lck: 'var(--border-radius)',
            },
          },
        },
      },
    })
    await installModule('@pinia/nuxt')

    addPlugin(resolve('./runtime/plugins/1_error'))
    addPlugin(resolve('./runtime/plugins/2_directive'))
    addPlugin(resolve('./runtime/plugins/3_i18n'))
    addPlugin(resolve('./runtime/plugins/5_vee-validate'))
    addPlugin(resolve('./runtime/plugins/6_middlewares'))

    // await addComponentsDir({
    //   path: resolve(componentsDir),
    //   prefix: 'lck-',
    // })

    /**
     * Add local styles
     */
    nuxt.options.css = nuxt.options.css ?? []
    // nuxt.options.css.push('primevue/resources/primevue.css')
    nuxt.options.css.push('bootstrap-icons/font/bootstrap-icons.css')

    nuxt.options.css.push(resolve('./runtime/styles/index.' + styleExtension))
    nuxt.options.css.push(resolve('./runtime/styles/global.' + styleExtension))
    nuxt.options.css.push(resolve('./runtime/styles/theme.css'))

    // nuxt.options.build.transpile.push('primevue')

    // console.log('[nuxt-locokit][plugin-locokit] Registering components...')

    // for (const name in components) {
    //   console.log('[nuxt-locokit][plugin-locokit] Registering component ' + name + '...')
    //   nuxt.vueApp.component(name, {
    //     // extend the original component
    //     extends: components[name],
    //   })
    // }

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
        file: resolve('./runtime/pages/workspace/index.vue'),
        children: [
          {
            name: ROUTES_NAMES.WORKSPACE.DASHBOARD,
            path: ROUTES_PATH.WORKSPACE.DASHBOARD,
            meta: {
              protected: true,
            },
            file: resolve(
              './runtime/pages/workspace/DashboardPage/DashboardPage.vue',
            ),
          },
          {
            name: ROUTES_NAMES.WORKSPACE.DATASOURCE.HOME,
            path: ROUTES_PATH.WORKSPACE.DATASOURCE.HOME,
            meta: {
              protected: true,
            },
            file: resolve('./runtime/pages/workspace/datasource/index.vue'),
            children: [
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.ABOUT,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.ABOUT,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/AboutDatasource/AboutDatasource.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.CREATE,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/CreateDatasource/CreateDatasource.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.UPDATE,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.UPDATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/UpdateDatasource/UpdateDatasource.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.SCHEMA,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.SCHEMA,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/SchemaDatasource/SchemaDatasource.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.TABLE.RECORD,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.TABLE.RECORD,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/RecordTable/RecordTable.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.TABLE.CREATE,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.TABLE.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/CreateTable/CreateTable.vue',
                ),
              },
              {
                name: ROUTES_NAMES.WORKSPACE.DATASOURCE.TABLE.UPDATE,
                path: ROUTES_PATH.WORKSPACE.DATASOURCE.TABLE.UPDATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/workspace/datasource/UpdateTable/UpdateTable.vue',
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
              './runtime/pages/workspace/SettingsWorkspace/SettingsWorkspace.vue',
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
        file: resolve('./runtime/pages/admin/index.vue'),
        redirect: ROUTES_PATH.ADMIN.USERS.HOME,
        children: [
          {
            name: ROUTES_NAMES.ADMIN.USERS.HOME,
            path: ROUTES_PATH.ADMIN.USERS.HOME,
            meta: {
              protected: true,
            },
            file: resolve('./runtime/pages/admin/users/index.vue'),
            redirect: ROUTES_PATH.ADMIN.USERS.ABOUT,
            children: [
              {
                name: ROUTES_NAMES.ADMIN.USERS.ABOUT,
                path: ROUTES_PATH.ADMIN.USERS.ABOUT,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/admin/users/AboutUsers/AboutUsers.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.USERS.CREATE,
                path: ROUTES_PATH.ADMIN.USERS.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/admin/users/CreateUser/CreateUser.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.USERS.RECORD,
                path: ROUTES_PATH.ADMIN.USERS.RECORD,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/admin/users/RecordUser/RecordUser.vue',
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
            file: resolve('./runtime/pages/admin/groups/index.vue'),
            redirect: ROUTES_PATH.ADMIN.GROUPS.ABOUT,
            children: [
              {
                name: ROUTES_NAMES.ADMIN.GROUPS.ABOUT,
                path: ROUTES_PATH.ADMIN.GROUPS.ABOUT,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/admin/groups/AboutGroups/AboutGroups.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.GROUPS.CREATE,
                path: ROUTES_PATH.ADMIN.GROUPS.CREATE,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/admin/groups/CreateGroup/CreateGroup.vue',
                ),
              },
              {
                name: ROUTES_NAMES.ADMIN.GROUPS.RECORD,
                path: ROUTES_PATH.ADMIN.GROUPS.RECORD,
                meta: {
                  protected: true,
                },
                file: resolve(
                  './runtime/pages/admin/groups/RecordGroup/RecordGroup.vue',
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
        file: resolve('./runtime/pages/profile/index.vue'),
        redirect: ROUTES_PATH.PROFILE.UPDATE_GENERAL,
        children: [
          {
            name: ROUTES_NAMES.PROFILE.UPDATE_GENERAL,
            path: ROUTES_PATH.PROFILE.UPDATE_GENERAL,
            meta: {
              protected: true,
            },
            file: resolve(
              './runtime/pages/profile/UpdateGeneral/UpdateGeneral.vue',
            ),
          },
          {
            name: ROUTES_NAMES.PROFILE.UPDATE_EMAIL,
            path: ROUTES_PATH.PROFILE.UPDATE_EMAIL,
            meta: {
              protected: true,
            },
            file: resolve(
              './runtime/pages/profile/UpdateEmail/UpdateEmail.vue',
            ),
          },
          {
            name: ROUTES_NAMES.PROFILE.UPDATE_PASSWORD,
            path: ROUTES_PATH.PROFILE.UPDATE_PASSWORD,
            meta: {
              protected: true,
            },
            file: resolve(
              './runtime/pages/profile/UpdatePassword/UpdatePassword.vue',
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
        file: resolve('./runtime/pages/WorkspacesList/WorkspacesList.vue'),
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
        file: resolve('./runtime/pages/CreateWorkspace/CreateWorkspace.vue'),
      })

      pages.push({
        name: ROUTES_NAMES.HOME,
        path: ROUTES_PATH.HOME,
        file: resolve('./runtime/pages/index.vue'),
        meta: {
          protected: false,
        },
      })

      /**
       * Register auth pages
       */
      if (submodules.auth.enabled) {
        console.log('[nuxt-locokit] registering auth routes...')
        const prefix = submodules.auth.prefix
        pages.push(
          ...[
            {
              name: ROUTES_NAMES.AUTH.SIGN_IN,
              path: prefix + ROUTES_PATH.AUTH.SIGN_IN,
              file: resolve('./runtime/pages/auth/SignIn.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
            {
              name: ROUTES_NAMES.AUTH.LOST_PASSWORD,
              path: prefix + ROUTES_PATH.AUTH.LOST_PASSWORD,
              file: resolve('./runtime/pages/auth/LostPassword.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
            {
              name: ROUTES_NAMES.AUTH.VERIFY_SIGNUP,
              path: prefix + ROUTES_PATH.AUTH.VERIFY_SIGNUP,
              file: resolve('./runtime/pages/auth/VerifySignup.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
            {
              name: ROUTES_NAMES.AUTH.RESET_PASSWORD,
              path: prefix + ROUTES_PATH.AUTH.RESET_PASSWORD,
              file: resolve('./runtime/pages/auth/ResetPassword.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
            {
              name: ROUTES_NAMES.AUTH.SIGN_UP,
              path: prefix + ROUTES_PATH.AUTH.SIGN_UP,
              file: resolve('./runtime/pages/auth/SignUp.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
            {
              name: ROUTES_NAMES.AUTH.ALREADY_AUTHENTICATED,
              path: prefix + ROUTES_PATH.AUTH.ALREADY_AUTHENTICATED,
              file: resolve('./runtime/pages/auth/AlreadyAuthenticated.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
            {
              name: ROUTES_NAMES.AUTH.CONFIRM_UPDATE_EMAIL,
              path: prefix + ROUTES_PATH.AUTH.CONFIRM_UPDATE_EMAIL,
              file: resolve('./runtime/pages/auth/ConfirmUpdateEmail.vue'),
              meta: {
                anonymous: true,
                protected: false,
              },
            },
          ],
        )
      }

      /**
       * Register back office pages
       */
      if (submodules.backoffice.enabled) {
        //   const prefix = submodules.backoffice.prefix
        //   pages.push(...getBackofficePages(prefix))
      }

      /**
       * Register front office pages
       */
      if (submodules.frontoffice.enabled) {
        //   const prefix = submodules.frontoffice.prefix
        //   pages.push(...getFrontofficePages(prefix))
      }
    })

    addRouteMiddleware({
      name: 'anonymous-routes',
      path: resolve('./runtime/middleware/anonymousRoutes'),
    })
    console.log('[nuxt-module] setup ok.')
  },
})
