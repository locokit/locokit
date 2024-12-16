<template>
  <div
    class="h-full bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1 bg-primary"
    :style="{
      'background-image': 'url(' + props.backgroundImageUrl + ')',
    }"
  >
    <div class="flex-grow max-w-2xl">
      <a v-if="props.logoImageUrl" class="text-center" :href="props.logoLinkUrl">
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

const props = defineProps<{
  /**
   * The background image displayed
   */
  backgroundImageUrl?: string
  /**
   * A logo displayed, center aligned
   */
  logoImageUrl?: string
  logoLinkUrl?: string
  textBottomRight?: string
}>()

defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

defineSlots<{
  /**
   * The main slot
   *
   * Will be displayed under the logo if any.
   */
  default(): any
}>()
</script>
