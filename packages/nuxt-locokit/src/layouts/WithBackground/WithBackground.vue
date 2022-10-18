<template>
  <div
    class="h-screen bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1"
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
    }"
  >
    <slot />
    <div class="absolute bottom-2 right-2 text-white text-xs">
      {{ version }}
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    backgroundImage: string
    version?: string
  }>(),
  {
    version: 'v0.0.17',
  },
)
</script>
