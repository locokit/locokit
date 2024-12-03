<template>
  <div
    class="h-full bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1 bg-primary"
    :style="{
      'background-image': 'url(' + props.backgroundImageUrl + ')',
    }"
  >
    <div class="flex-grow max-w-2xl">
      <a v-if="props.logoImageUrl" class="text-center" :href="props.logoImageHref">
        <img
          alt="logo"
          class="mb-4 mx-auto max-w-full"
          :src="props.logoImageUrl"
          aria-hidden="true"
        />
      </a>
      <slot />
    </div>

    <div class="absolute bottom-2 right-2 text-white text-xs">
      {{ props.textBottomRight }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Slot } from 'vue'

const props = defineProps<{
  /**
   * The background image displayed
   */
  backgroundImageUrl?: string
  /**
   * A logo displayed, center aligned
   */
  logoImageUrl?: string
  logoImageHref?: string
  textBottomRight?: string
}>()

defineSlots<{
  /**
   * The main slot
   *
   * Will be displayed under the logo if any.
   */
  default: Slot
}>()
</script>
