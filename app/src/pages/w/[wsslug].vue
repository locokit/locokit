<script setup lang="ts">
import { sdkClient } from '@/services/sdk'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'

const { t } = useI18n()
const route = useRoute()

definePage({
  name: ROUTE_NAMES.WORKSPACE.SLUG,
})

const workspaceSlug = (route.params as { wsslug?: string })?.wsslug
if (!workspaceSlug) {
  throw new Error('Workspace slug is required')
}

const state = ref({
  loading: false,
  data: null as WorkspaceResult | null,
  error: null as Error | null,
})

async function fetchWorkspace() {
  state.value.loading = true
  try {
    const workspaceResponse = await sdkClient.service('/core/workspace').find({
      query: {
        slug: workspaceSlug,
      },
    })
    if (workspaceResponse.total !== 1) {
      throw new Error(`Workspace not found (${workspaceResponse.total} item-s found)`)
    }
    state.value.data = workspaceResponse.data
  } catch (error) {
    state.value.error = error as Error
    console.error(error)
  }
  state.value.loading = false
}

onMounted(() => {
  fetchWorkspace()
})
</script>

<template>
  <LayoutHeader>
    <h1 class="text-primary text-4xl my-4">
      {{ t('locokit.pages.workspace.title') }} {{ state.data?.name }}
    </h1>
    {{ state.data?.name }}
    <template v-if="state.loading">
      <p>{{ t('locokit.pages.workspace.loading') }}</p>
    </template>
    <template v-else-if="state.error">
      <p>{{ t('locokit.pages.workspace.error') }}</p>
    </template>
    <template v-else>
      {{ state.data }}
    </template>
  </LayoutHeader>
</template>
