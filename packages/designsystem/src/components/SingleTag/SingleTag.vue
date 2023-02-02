<template>
  <span
    class="lck-tag px-2 ml-2 inline-flex min-w-0 max-w-full first-of-type:ml-0"
    :style="{ color, backgroundColor }"
  >
    <span class="max-w-full text-ellipsis overflow-hidden inline-block">
      {{ label }}
    </span>
  </span>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    label: string
    color?: string | null
    backgroundColor?: string | null
  }>(),
  {
    color: null,
    backgroundColor: null,
  },
)
</script>

<style>
.lck-tag {
  border-radius: var(--border-radius);
  /* for default purpose */
  background-color: var(--primary-color);
  color: var(--color-white);
}
</style>
