<template>
  <WithThinNavAndSidebar
    v-model:open-panel="openPanelToAddNewWorkspace"
    :can-manage-close-sidebar="false"
  >
    <template v-if="navMenuItems.length > 0" #navMenu>
      <NuxtLink
        v-for="navMenuItem in navMenuItems"
        :key="navMenuItem.label"
        :aria-label="navMenuItem.label"
      >
        <PrimeButton :icon="navMenuItem.icon" />
      </NuxtLink>
    </template>
    <template #main>
      <div
        class="max-w-4xl xl:max-w-6xl mx-auto mt-8"
        @keyup.esc="handlePanelForm(false)"
      >
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
    </template>
    <template #panelHeader>
      <h2>
        {{ $t('pages.workspace.form.title') }}
      </h2>
    </template>
    <template #panelContent>
      <div class="m-4">
        <WorkspaceForm :loading="loading" />
      </div>
    </template>
  </WithThinNavAndSidebar>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { WorkspaceForm } from '@locokit/designsystem'
import { ROUTES_NAMES } from '../../paths'
import WithThinNavAndSidebar from '../../layouts/WithThinNavAndSidebar.vue'
import { useStoreWorkspaces } from '../../stores/workspaces'
import { ref, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const storeWorkspaces = useStoreWorkspaces()

const { loading } = storeToRefs(storeWorkspaces)
const openPanelToAddNewWorkspace = ref(false)

const handlePanelForm = (value: boolean) => {
  openPanelToAddNewWorkspace.value = value
}

const navMenuItems = [
  {
    label: 'Test',
    icon: 'pi pi-home',
    routeName: ROUTES_NAMES.HOME,
  },
]

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
