<template>
  Workspace detail {{ workspace }}

  {{ route }}
</template>

<script setup lang="ts">
  const route = useRoute()
defineProps({
  workspace: String
})
</script>
