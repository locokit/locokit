<template>
  <div class="max-w-lg lg:h-full mx-auto px-4 lg:px-0 flex flex-col">
    <div class="my-8">
      <h1>Bouh</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()

// Initialization
// let currentDatasource: Datasource | null = null
// const res = await findDatasources(
//   {
//     params: { slug: route.params.datasourceSlug as string },
//   },
//   route.params.workspaceSlug as string,
// )
// if (res && res.data.length === 1) {
//   currentDatasource = res.data[0]
// }

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  loading.value = false
}
</script>
