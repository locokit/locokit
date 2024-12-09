<script setup lang="ts">
import { useSDK } from '@/composables/useSDK'
import { onMounted, ref } from 'vue'
import LayoutHeader from '@/layouts/header.vue'

const { sdkClient } = useSDK()
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
