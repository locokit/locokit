<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
  Hello world
  <button @click="emit('click')">
    coucou
  </button>
</template>