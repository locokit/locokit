<template>
  <Teleport defer :to="sidebar" v-if="sidebar">
    <aside class="py-2 px-3">
      <h2 class="text-2xl mb-3">{{ t('locokit.pages.workspace.datasources') }}</h2>
      <ul>
        <sidebar-item v-for="item in items" :item :key="item.key" />
      </ul>
    </aside>
  </Teleport>

  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="Component" />
    <template v-else>
      <main class="p-3">
        <h1 class="text-primary text-4xl mt-0 mb-4">
          {{ t('locokit.pages.workspace.title') }} {{ workspace?.name }}
        </h1>

        <h2 class="text-primary text-2xl mt-0 mb-4">{{ t('locokit.pages.datasource.title') }}</h2>

        <div class="flex flex-wrap gap-2">
          <template v-if="workspace.datasources">
            <router-link
              v-for="datasource in workspace.datasources"
              :key="datasource.id"
              class="bg-primary hover:bg-primary-400 hover:font-bold text-white w-48 h-16 rounded-md flex items-center justify-center p-2 overflow-hidden relative"
              :to="{
                name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG,
                params: {
                  wslug: workspace.slug,
                  dsslug: datasource.slug,
                },
              }"
            >
              <i
                class="bi bi-database text-4xl absolute bottom-[-0.25rem] left-[-0.25rem] opacity-25"
              />
              <h3 class="text-lg text-ellipsis whitespace-nowrap overflow-hidden">
                {{ datasource.name }}
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
import { useI18n } from 'vue-i18n'
import { computed, inject, type RendererElement } from 'vue'
import SidebarItem from '@/components/sidebar-item.vue'
import type { DatasourceResult } from '@locokit/sdk/dist/src/services/core/datasource/datasource.schema'

const sidebar = inject<RendererElement>('sidebar')

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.ROOT,
})

const workspace = inject<
  WorkspaceResult & {
    datasources?: (DatasourceResult & { tables?: [] })[]
  }
>('workspace')

const items = computed(() =>
  workspace.value?.datasources?.map((d) => ({
    key: 'datasource-' + d.id,
    label: d.slug,
    icon: 'bi bi-database text-xl',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG,
      params: { wsslug: workspace.value.slug, dsslug: d.slug },
    },
    children: d.tables?.map((t) => ({
      key: 'table-' + t.id,
      label: t.slug,
      icon: 'bi bi-table text-xl',
      to: {
        name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG,
        params: { wsslug: workspace.value.slug, dsslug: d.slug, tslug: t.slug },
      },
    })),
  })),
)
</script>
