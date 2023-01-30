<template>
  <WithBanner>
    <div class="max-w-4xl xl:max-w-6xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <h1 class="text-primary font-medium">
        {{ $t('pages.workspace.title') }}
      </h1>
      <p class="mt-4">
        {{ $t('pages.workspace.intro') }}
      </p>
      <NuxtLink :to="{ name: ROUTES_NAMES.WORKSPACE.CREATE }">
        <PrimeButton class="!rounded-full !pr-5 !mt-4">
          <div
            class="relative flex flex-row justify-center text-center font-bold w-full"
          >
            <i class="bi bi-plus block font-medium" />
            <p class="mx-autotext-primary pl-1">
              {{ $t('pages.workspace.createWorkspace') }}
            </p>
          </div>
        </PrimeButton>
      </NuxtLink>
      <div class="mt-12">
        <div
          v-if="
            workspacesStore.workspaces && workspacesStore.workspaces.length > 0
          "
          class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-8 flex-wrap shrink-0"
        >
          <div
            v-for="workspace in workspacesStore.workspaces"
            :key="workspace.slug"
            class="h-44 lg:h-56 bg-gray-200 text-black box-border rounded !border-dashed !border-2 !border-gray-300 hover:!border-primary"
            :style="{
              backgroundColor: workspace.settings?.backgroundColor,
              color: workspace.settings?.color,
            }"
          >
            <div
              class="relative overflow-hidden flex flex-col h-full justify-center text-center font-bold cursor-pointer"
            >
              <NuxtLink class="text-theme-text">
                <p class="text-2xl line-clamp-3">
                  {{ workspace.name }}
                </p>
              </NuxtLink>
              <i class="absolute -left-3 -bottom-3 text-9xl opacity-10"
                :class="`bi ${workspace.settings?.icon}`" />
              <span
                class="px-2 max-w-fit rounded absolute bottom-1 right-1 bg-gray-300 text-black text-sm">
                {{ $t('pages.workspace.public') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WithBanner>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { ROUTES_NAMES } from '../../paths'
import { useStoreWorkspaces } from '../../stores/workspaces'
import WithBanner from '../../layouts/WithBanner.vue'
import { useHead, onMounted } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const workspacesStore = useStoreWorkspaces()

onMounted(async () => {
  await workspacesStore.findWorkspaces()
})

useHead({
  titleTemplate: `${t('pages.workspace.title')} | %s`,
})
</script>
