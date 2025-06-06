<template>
  <LayoutSidebar
    v-if="workspace"
    locokit-logo-url="/assets/themes/locokit/logo.svg"
    workspace-logo-url="/assets/themes/hm/logo.png"
  >
    <template #breadcrumb>
      <nav class="flex gap-2 overflow-x-auto">
        <template v-for="(b, index) in breadcrumbItems" :key="`breadcrumb-${index}`">
          <router-link :to="b.to" v-if="b.to">
            <i :class="b.icon" v-if="b.icon" />
            {{ b.label }}
          </router-link>
          <div v-else>
            <i :class="b.icon" v-if="b.icon" />
            {{ b.label }}
          </div>
          <i v-if="index < breadcrumbItems.length - 1" class="bi bi-chevron-right" />
        </template>
      </nav>
    </template>
    <template #sidebar-title>
      <h3 class="flex items-center text-2xl font-bold">
        <template v-if="workspace">
          <i
            v-if="workspace.settings?.icon"
            :class="workspace.settings?.icon"
            class="w-8 h-8 rounded-full mr-2"
          />
          <img v-else class="w-8 h-8 rounded-full mr-2" src="/assets/themes/locokit/favicon.svg" />
          {{ workspace.name }}
        </template>
        <template v-else>
          <i class="pi pi-spin pi-spinner"></i>
        </template>
      </h3>
    </template>
    <template #sidebar-nav>
      <ul class="pl-2">
        <sidebar-item v-for="i in items" :item="i" :key="i.key" />
      </ul>
    </template>
    <slot></slot>
  </LayoutSidebar>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'
import type { DatasourceResult } from '@locokit/sdk/dist/src/services/core/datasource/datasource.schema'
import { LayoutSidebar } from '@locokit/vue-components'
import { RouterLink } from 'vue-router'
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SidebarItem from '@/components/sidebar-item.vue'

const { t } = useI18n()

const props = defineProps<{
  workspace?: WorkspaceResult & {
    datasources?: (DatasourceResult & { tables?: [] })[]
  }
}>()

const { breadcrumbItems } = useBreadcrumb()

const items = computed(() => [
  {
    key: 'datasources',
    label: t('locokit.pages.workspace.datasources'),
    icon: 'bi bi-database-fill text-xl',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.ROOT,
      params: { wsslug: props.workspace.slug },
    },
    children: props.workspace?.datasources?.map((d) => ({
      key: 'datasource-' + d.id,
      label: d.slug,
      icon: 'bi bi-database text-xl',
      to: {
        name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG,
        params: { wsslug: props.workspace.slug, dsslug: d.slug },
      },
      children: d.tables?.map((t) => ({
        key: 'table-' + t.id,
        label: t.slug,
        icon: 'bi bi-table text-xl',
        to: {
          name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG,
          params: { wsslug: props.workspace.slug, dsslug: d.slug, tslug: t.slug },
        },
      })),
    })),
  },
  {
    key: 'policies',
    label: t('locokit.pages.workspace.policies'),
    icon: 'bi bi-shield-lock-fill text-xl',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.POLICIES.ROOT,
      params: { wsslug: props.workspace.slug },
    },
  },
  {
    key: 'groups',
    label: t('locokit.pages.workspace.groups'),
    icon: 'bi bi-people-fill text-xl',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.ROOT,
      params: { wsslug: props.workspace.slug },
    },
  },
])
</script>
