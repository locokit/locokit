<template>
  <span
    v-if="label"
    class="lck-tag py-0.5 px-1 ml-2 inline-flex min-w-0 max-w-full first-of-type:ml-0"
    :class="[borderColor ? `border border[${borderColor}]` : '']"
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
    label?: string | undefined
    color?: string | null
    backgroundColor?: string | null
    borderColor?: string | null
  }>(),
  {
    label: undefined,
    color: null,
    backgroundColor: null,
    borderColor: null,
  },
)
</script>

<style>
.lck-tag {
  @apply rounded-lck bg-primary text-white border-primary;
}
</style>
