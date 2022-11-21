<template>
  <div>
    <TagLabel
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
import type { SelectValue } from '@/interface/interface'
import TagLabel from '@/components/TagLabel/TagLabel.vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    options: SelectValue[]
  }>(),
  {
    options: () => [],
  },
)
</script>
