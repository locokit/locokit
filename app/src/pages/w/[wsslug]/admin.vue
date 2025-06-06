<template>
  <layout-sidebar-workspace :workspace="workspace" :loading="stateWorkspace.loading">
    <router-view v-slot="{ Component }">
      <component :is="Component" v-if="Component && workspace" :workspace="workspace" />
      <template v-else>
        <main class="p-3">
          <h1 class="text-primary text-4xl mt-0 mb-4">
            {{ t('locokit.pages.workspace.title') }} {{ workspace?.name }}
          </h1>
          <template v-if="stateWorkspace.loading">
            <p><i class="pi pi-spin pi-spinner"></i> {{ t('locokit.pages.workspace.loading') }}</p>
          </template>
          <template v-else-if="stateWorkspace.error">
            <p>{{ t('locokit.pages.workspace.error') }}</p>
          </template>
          <template v-else>
            {{ stateWorkspace.workspace?.documentation }}
          </template>
        </main>
      </template>
    </router-view>
  </layout-sidebar-workspace>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'
import { RouterView } from 'vue-router'
import { provide, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LayoutSidebarWorkspace from '@/layouts/sidebar-workspace.vue'
import { useWorkspace } from '@/composables/useWorkspace'

const { t } = useI18n()
const route = useRoute()
const { state: stateWorkspace, fetchWorkspace, resetWorkspace } = useWorkspace()

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.ROOT,
})

const workspaceSlug = computed(() => {
  return (route.params as { wsslug?: string })?.wsslug
})
if (!workspaceSlug.value) {
  throw new Error('Workspace slug is required')
}

const workspace = computed<WorkspaceResult>(() => {
  return stateWorkspace.value.workspace
})
provide('workspace', workspace)

watch(
  () => workspaceSlug.value,
  (newWorkspaceSlug) => {
    if (!newWorkspaceSlug) resetWorkspace()
    else fetchWorkspace(newWorkspaceSlug)
  },
  {
    immediate: true,
  },
)
</script>
