<template>
  <div
    class="h-screen bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1 bg-primary"
    :style="{
      'background-image': 'url(' + props.backgroundImageUrl + ')',
    }"
  >
    <div class="flex-grow max-w-2xl">
      <a
        v-if="props.logoImageUrl"
        class="text-center"
        :href="props.logoImageHref"
      >
        <img
          alt="logo"
          class="mb-4 mx-auto"
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
const props = defineProps({
  backgroundImageUrl: {
    type: String,
    default: null,
  },
  logoImageUrl: {
    type: String,
    default: null,
  },
  logoImageHref: {
    type: String,
    default: '/',
  },
  textBottomRight: {
    type: String,
    default: null,
  },
})
</script>

<style scoped>
img {
  max-width: 100%;
}

@media only screen and (max-device-width: 480px) {
  img {
    max-width: 90%;
  }
}
</style>
