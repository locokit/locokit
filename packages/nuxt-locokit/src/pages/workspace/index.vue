<template>
  <WithBanner :navlinks="navLinksBanner">
    <div class="max-w-4xl xl:max-w-6xl mx-auto mt-8">
      <h1 class="text-primary font-medium">
        {{ $t('pages.workspace.title') }}
      </h1>
      <div class="mt-12">
        <h2 class="text-primary">
          {{ $t('pages.workspace.myWorkspace') }}
        </h2>
        <div class="flex lg:gap-4 xl:gap-6 mt-8 flex-wrap shrink-0">
          <div
            v-for="workspace in test"
            :key="workspace"
            class="md-4 box-border lg:w-52 xl:w-56 rounded h-40 bg-theme hover:!bg-theme-hover"
            :data-theme="workspace.settings?.color"
          >
            <div
              class="relative overflow-hidden flex flex-col h-full justify-center text-center font-bold cursor-pointer"
            >
              <NuxtLink class="text-theme-text">
                <p class="text-2xl">
                  {{ workspace.name }}
                </p>
              </NuxtLink>
              <i
                class="absolute -left-3 -bottom-3 text-9xl opacity-10"
                :class="`pi ${workspace.settings?.icon}`"
              />
              <span
                v-if="workspace.public"
                class="px-2 max-w-fit rounded absolute bottom-1 right-1 bg-gray-300 text-black text-sm"
              >
                {{ $t('pages.workspace.public') }}
              </span>
            </div>
          </div>
          <NuxtLink :to="{ name: ROUTES_NAMES.WORKSPACE.CREATE }">
            <PrimeButton
              class="md-4 h-40 p-button-link box-border lg:w-52 xl:w-56 !border-dashed !border-2 !border-gray-300 rounded !p-0 hover:!border-primary"
            >
              <div
                class="relative overflow-hidden flex flex-col justify-center text-center font-bold w-full"
              >
                <i class="pi pi-plus-circle block !text-2xl" />
                <p class="block mx-autotext-primary mt-4">
                  {{ $t('pages.workspace.newWorkspace') }}
                </p>
              </div>
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </WithBanner>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ROUTES_NAMES } from '../../paths'
import { useStoreWorkspaces } from '../../stores/workspaces'
import WithBanner from '../../layouts/WithBanner.vue'
import { useStoreAuth } from '../../stores/auth'
import { computed, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const authStore = useStoreAuth()
const storeWorkspaces = useStoreWorkspaces()

const { loading } = storeToRefs(storeWorkspaces)

const navLinksBanner = computed(() => {
  return authStore.isAuthenticated
    ? [
        {
          routeName: ROUTES_NAMES.HOME,
          title: 'home',
          icon: 'pi-home',
        },
      ]
    : [
        {
          routeName: ROUTES_NAMES.HOME,
          title: 'home',
          icon: 'pi-home',
        },
        {
          routeName: ROUTES_NAMES.AUTH.SIGN_IN,
          title: 'signIn',
          icon: 'pi-sign-in',
        },
        {
          routeName: ROUTES_NAMES.AUTH.SIGN_UP,
          title: 'signUp',
          icon: 'pi-user',
        },
      ]
})

const test = [
  {
    name: 'Centre de ressources',
    slug: 'centre_de_ressources',
    documentation: 'blabla',
    public: true,
    settings: {
      color: 'malibu',
      icon: ' pi pi-home',
    },
  },
  {
    name: 'CaPeL',
    slug: 'capel',
    documentation: 'blabla',
    public: false,
    settings: null,
  },
  {
    name: 'Aperture',
    slug: 'aperture',
    documentation: 'blabla',
    public: false,
    settings: {
      color: 'lol',
      icon: ' pi pi-home',
    },
  },
  {
    name: 'Nobu',
    slug: 'nobu',
    documentation: 'blabla',
    public: false,
    settings: null,
  },
]

// await storeWorkspaces.fetch()
useHead({
  titleTemplate: `${t('pages.workspace.title')} | %s`,
})
</script>
