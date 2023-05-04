<template>
  <WithHeader>
    <div class="max-w-6xl xl:max-w-6xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <h1 class="text-primary font-medium">
        {{ $t('pages.workspacesList.title') }}
      </h1>
      <p class="mt-4">
        {{ $t('pages.workspacesList.intro') }}
      </p>
      <NuxtLink :to="{ name: ROUTES_NAMES.CREATE_WORKSPACE }">
        <PrimeButton class="p-button-rounded p-button-secondary !pr-5 !mt-4">
          <div
            class="relative flex flex-row justify-center text-center font-bold w-full"
          >
            <i class="bi bi-plus block font-medium" />
            <p class="mx-autotext-primary pl-1">
              {{ $t('pages.workspacesList.addWorkspace') }}
            </p>
          </div>
        </PrimeButton>
      </NuxtLink>
      <div class="mt-12">
        <div
          v-if="workspaces && workspaces.total > 0"
          class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-8 flex-wrap shrink-0"
        >
          <div
            v-for="workspace in workspaces.data"
            :key="workspace.slug"
            class="h-44 lg:h-56 bg-gray-200 text-black box-border rounded !border-dashed !border-2 !border-gray-300 hover:!border-primary"
            :style="{
              backgroundColor: workspace.settings?.backgroundColor,
              color: workspace.settings?.color,
            }"
          >
            <NuxtLink
              :to="{
                name: ROUTES_NAMES.WORKSPACE.HOME,
                params: {
                  id: workspace.id,
                },
              }"
            >
              <div
                class="relative overflow-hidden flex flex-col h-full justify-center text-center font-bold cursor-pointer"
              >
                <p class="text-2xl line-clamp-3">
                  {{ workspace.name }}
                </p>
                <i
                  class="absolute -left-3 -bottom-3 text-9xl opacity-50"
                  :class="workspace.settings?.icon"
                />
                <span
                  v-if="workspace.public"
                  class="px-2 max-w-fit rounded absolute bottom-1 right-1 bg-gray-300 text-black text-sm"
                >
                  {{ $t('pages.workspacesList.public') }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ROUTES_NAMES } from '../../paths'
import { useStoreWorkspaces } from '../../stores/workspaces'
import WithHeader from '../../layouts/WithHeader.vue'
import { useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const workspacesStore = useStoreWorkspaces()
const { workspaces } = storeToRefs(workspacesStore)

// Initialization
await workspacesStore.updateWorkspaces()

useHead({
  titleTemplate: `${t('pages.workspacesList.title')} | %s`,
})
</script>
