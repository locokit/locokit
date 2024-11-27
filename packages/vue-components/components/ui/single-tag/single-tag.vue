<template>
  <span
    class="rounded-lg bg-primary text-white border-primary py-1 px-2 ml-2 inline-flex min-w-8 min-h-4 max-w-full first-of-type:ml-0"
    :class="{
      [`border border-[${borderColor}]`]: borderColor,
    }"
    :style="{
      color,
      backgroundColor
    }"
  >
    <span class="line-clamp-1">
      {{ label }}
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * Label to be displayed
     */
    label: string | undefined
    /**
     * Color for the text
     */
    color?: string
    /**
     * Background color class of the tag
     */
    backgroundColor?: string
    /**
     * Border color class of the tag
     */
    borderColor?: string
  }>(),
  {
    label: undefined,
    color: 'white',
    backgroundColor: 'gray',
  },
)
</script>
