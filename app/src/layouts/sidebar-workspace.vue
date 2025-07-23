<template>
  <LayoutSidebar
    v-if="workspace"
    locokit-logo-url="/assets/themes/locokit/logo.svg"
    workspace-logo-url="/assets/themes/locokit/logo.svg"
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
      <h3 class="flex items-center gap-2 text-2xl font-bold" v-if="workspace">
        <div class="flex items-center justify-center w-[3rem]">
          <i
            v-if="workspace.settings?.icon"
            :class="workspace.settings?.icon"
            class="w-8 h-8 rounded-full mr-2"
          />
          <img v-else class="w-8 h-8 rounded-full" src="/assets/themes/locokit/favicon.svg" />
        </div>
        {{ workspace.name }}
      </h3>
      <div v-else>
        <i class="pi pi-spin pi-spinner"></i>
      </div>
    </template>
    <template #sidebar-nav>
      <div class="flex h-full">
        <div class="w-[3rem] bg-primary flex flex-col border-r border-white text-white">
          <router-link
            v-for="i in items"
            :key="i.key"
            :to="i.to"
            :title="i.label"
            class="w-[3rem] h-[3rem] flex items-center justify-center hover:bg-white hover:text-primary"
            :active-class="i.activeClass"
            :exact-active-class="i.exactActiveClass"
          >
            <i :class="i.icon" />
          </router-link>
        </div>
        <div class="grow overflow-y-auto overflow-x-hidden" ref="sidebar"></div>
      </div>
    </template>
    <div class="relative z-10 h-full">
      <slot></slot>
    </div>
  </LayoutSidebar>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'
import type { DatasourceResult } from '@locokit/sdk/dist/src/services/core/datasource/datasource.schema'
import { LayoutSidebar } from '@locokit/vue-components'
import { RouterLink } from 'vue-router'
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import { computed, provide, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const sidebar = useTemplateRef('sidebar')
provide('sidebar', sidebar)

const props = defineProps<{
  workspace?: WorkspaceResult & {
    datasources?: (DatasourceResult & { tables?: [] })[]
  }
}>()

const { breadcrumbItems } = useBreadcrumb()

const items = computed(() => [
  {
    key: 'workspace',
    label: t('locokit.pages.workspace.title'),
    icon: 'bi bi-house-fill text-xl',
    exactActiveClass: 'bg-white text-primary',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.ROOT,
      params: { wsslug: props.workspace.slug },
    },
  },
  {
    key: 'datasources',
    label: t('locokit.pages.workspace.datasources'),
    icon: 'bi bi-database-fill text-xl',
    activeClass: 'bg-white text-primary',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.ROOT,
      params: { wsslug: props.workspace.slug },
    },
  },
  {
    key: 'policies',
    label: t('locokit.pages.workspace.policies'),
    icon: 'bi bi-shield-lock-fill text-xl',
    activeClass: 'bg-white text-primary',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.POLICIES.ROOT,
      params: { wsslug: props.workspace.slug },
    },
  },
  {
    key: 'groups',
    label: t('locokit.pages.workspace.groups'),
    icon: 'bi bi-people-fill text-xl',
    activeClass: 'bg-white text-primary',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.ROOT,
      params: { wsslug: props.workspace.slug },
    },
  },
])
</script>
