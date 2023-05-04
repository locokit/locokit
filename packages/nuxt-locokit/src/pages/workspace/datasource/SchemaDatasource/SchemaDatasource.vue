<template>
  <WithSidebar :open-panel="openPanel">
    <template #main>
      <div class="my-8">
        <h1 class="mb-4">WIP</h1>
        <div>
          <span>Schema</span>
          <div @click="openPanel = !openPanel">Click me</div>
        </div>
      </div>
    </template>
  </WithSidebar>
</template>
<script setup lang="ts">
import WithSidebar from '../../../../layouts/WithSidebar.vue'
import { ref } from '#imports'

const openPanel = ref<boolean | undefined>()
</script>
