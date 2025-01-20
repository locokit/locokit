<script setup lang="ts">
import { sdkClient } from '@/services/sdk'
import { onMounted, ref } from 'vue'
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'

definePage({
  name: ROUTE_NAMES.WORKSPACE.LIST,
})

const state = ref({
  loading: false,
  total: 0,
  skip: 0,
  limit: 20,
  data: [] as unknown[],
  error: null as Error | null,
})

async function fetchWorkspace() {
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
}

onMounted(() => {
  fetchWorkspace()
})
</script>

<template>
  <LayoutHeader> {{ state }}</LayoutHeader>
</template>
