<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="Component" />
    <template v-else>
      <main class="p-3">
        <h1 class="text-primary text-4xl mt-0 mb-4">
          {{ t('locokit.pages.workspace.title') }} {{ workspace?.name }}
        </h1>

        <h2 class="text-primary text-2xl mt-0 mb-4">
          {{ t('locokit.pages.datasource.title') }} {{ datasource?.name }}
        </h2>

        <div class="flex flex-wrap gap-2">
          <template v-if="datasource">
            <router-link
              v-for="table in datasource.tables"
              :key="table.id"
              class="bg-primary hover:bg-primary-400 hover:font-bold text-white w-48 h-16 rounded-md flex items-center justify-center p-2 overflow-hidden relative"
              :to="{
                name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG,
                params: {
                  wslug: workspace.slug,
                  dsslug: datasource.slug,
                  tslug: table.slug,
                },
              }"
            >
              <i
                class="bi bi-table text-4xl absolute bottom-[-0.25rem] left-[-0.25rem] opacity-25"
              />
              <h3 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">
                {{ table.name }}
              </h3>
            </router-link>
          </template>
        </div>
      </main>
    </template>
  </router-view>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'
import { computed, inject, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG,
})

const workspace = inject<WorkspaceResult>('workspace')
const route = useRoute()
const datasource = computed(() => {
  if (!workspace.value.datasources) return null
  return workspace.value.datasources.find((d) => d.slug === route.params.dsslug)
})
provide('datasource', datasource)
</script>
