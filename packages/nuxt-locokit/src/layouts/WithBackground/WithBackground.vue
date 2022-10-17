<template>
  <div
    class="h-screen bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1"
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
    }"
  >
    <slot />
    <div class="absolute bottom-0 right-0">
      {{ version }}
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    backgroundImage: string
    version: string
  }>(),
  {
    version: '0.0.17',
  },
)
</script>
