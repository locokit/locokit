<template>
  <main>
    Workspace detail {{ workspace }}

    {{ route }}
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
defineProps({
  workspace: String,
})
</script>
