<template>
  <div>
    <SingleTag
      v-for="option in options"
      :key="`${option.label}-${option.value}`"
      :background-color="option.backgroundColor"
      :color="option.color"
      :label="option.label"
    />
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SingleTag from '../SingleTag/SingleTag.vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    options: {
      label: string
      color: string
      backgroundColor: string
      position: number
    }[]
  }>(),
  {
    options: () => [],
  },
)
</script>
