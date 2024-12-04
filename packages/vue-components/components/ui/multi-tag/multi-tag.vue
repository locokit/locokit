<template>
  <div>
    <single-tag
      v-for="option in options"
      :key="`${option.label}-${option.position}`"
      :background-color="option.backgroundColor"
      :color="option.color"
      :label="option.label"
    />
  </div>
</template>

<script setup lang="ts">
import SingleTag from '../single-tag/single-tag.vue'

withDefaults(
  defineProps<{
    options: Array<{
      label: string
      color: string
      backgroundColor: string
      position?: number
    }>
  }>(),
  {
    options: () => [],
  },
)
</script>
