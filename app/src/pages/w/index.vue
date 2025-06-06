<script setup lang="ts">
import { sdkClient } from '@/services/sdk'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.WORKSPACE.LIST,
})

const state = ref({
  loading: false,
  total: 0,
  skip: 0,
  limit: 20,
  data: [] as WorkspaceResult[],
  error: null as Error | null,
})

async function fetchWorkspaces() {
  state.value.loading = true
  try {
    const workspaceResponse = await sdkClient.service('/core/workspace').find({
      query: {
        $skip: state.value.skip,
        $limit: state.value.limit,
      },
    })
    state.value.total = workspaceResponse.total
    state.value.data = workspaceResponse.data
  } catch (error) {
    state.value.error = error as Error
    console.error(error)
  }
  state.value.loading = false
}

onMounted(() => {
  fetchWorkspaces()
})
</script>

<template>
  <LayoutHeader>
    <div class="grow max-w-[1320px] mx-auto">
      <h1 class="text-primary text-4xl my-4">
        {{ t('locokit.pages.w.title') }}
      </h1>
      <template v-if="state.loading">
        <p>{{ t('locokit.pages.w.loading') }}</p>
      </template>
      <template v-else-if="state.error">
        <p>{{ t('locokit.pages.w.error') }}</p>
      </template>
      <template v-else>
        <div class="flex flex-wrap gap-4">
          <router-link
            v-for="workspace in state.data"
            :key="workspace.id"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.SLUG,
              params: { wsslug: workspace.slug },
            }"
            class="w-56 h-32 rounded-xl bg-primary text-white font-medium"
          >
            <div class="h-full relative flex items-center justify-center">
              <h2 class="text-xl text-center p-2">
                {{ workspace.name || t('locokit.pages.workspace.noName') }}
              </h2>

              <div
                v-if="workspace.public"
                class="absolute bottom-2 right-2 flex gap-1 items-center bg-secondary py-1 px-2 rounded-full"
              >
                <i class="bi bi-globe" :title="t('locokit.pages.w.public')" />
                {{ t('locokit.pages.w.public') }}
              </div>

              <i
                v-if="workspace.settings?.icon"
                class="workspaces-icon bi"
                :class="workspace.settings?.icon"
              />
            </div>
          </router-link>
        </div>
      </template>
    </div>
  </LayoutHeader>
</template>
