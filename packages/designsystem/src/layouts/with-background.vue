<template>
  <div
    class="bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1"
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
    }"
  >
    <slot> This is the main content of the layout. </slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  backgroundImage: String,
})
</script>
