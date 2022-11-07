<template>
  <div
    class="h-screen bg-cover bg-no-repeat bg-center grow flex justify-center items-center relative columns-1"
    :style="{
      'background-image': 'url(' + backgroundImage + ')',
    }"
  >
    <div class="flex-grow max-w-2xl">
      <NuxtLink
        v-if="backgroundLogo"
        class="text-center"
        :to="{ name: ROUTES_NAMES.HOME }"
      >
        <img alt="logo" :src="backgroundLogo" aria-hidden="true" />
      </NuxtLink>
      <slot />
    </div>
    <div class="absolute bottom-2 right-2 text-white text-xs">
      {{ version }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from '../pages/paths'
import { version } from '../../package.json'
import { computed, useRuntimeConfig } from '#imports'

// To retrieve config and environment variables
const runtimeConfig = useRuntimeConfig()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    backgroundImage?: string | null
    backgroundLogo?: string | null
  }>(),
  {
    backgroundImage: null,
    backgroundLogo: null,
  },
)

// Needed "computed" to initialise this var
const backgroundImage = computed(
  () => props.backgroundImage ?? runtimeConfig.public.HOME_BACKGROUND_IMAGE_URL,
)

// Needed "computed" to initialise this var
const backgroundLogo = computed(
  () => props.backgroundLogo ?? runtimeConfig.public.LOGO_BG_PRIMARY_URL,
)
</script>
