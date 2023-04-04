<template>
  <div
    class="h-screen bg-cover bg-no-repeat bg-center"
    :style="{
      background:
        'bottom center / contain no-repeat url' +
        '(' +
        runtimeConfig.public.ERROR_BACKGROUND_IMAGE_URL +
        ')' +
        'var(--primary-color)',
    }"
  >
    <div class="container mx-auto text-center justify-center flex-1">
      <span class="text-white pt-8 mb-2 text-3xl text-9xl font-black sr-only"
        >404</span
      >
      <h1 class="text-white pt-8 mb-2 text-3xl font-bold tracking-tight">
        {{ $t('pages.404.title') }}
      </h1>
      <h2 class="text-white pt-4 text-xl font-bold tracking-tight">
        {{ $t('pages.404.alternativeTitle') }}
      </h2>
      <NuxtLink
        :to="{ name: ROUTES_NAMES.HOME }"
        class="inline-block mt-4 p-component bg-green-600 hover:bg-green-800 text-white rounded-lg p-4 cursor-pointer ease-out hover:ease-in duration-500 border-solid border border-green-800"
      >
        <span
          class="bi bi-house-fill p-button-icon p-button-icon-left px-2"
          aria-hidden="true"
        ></span>
        <span class="p-button-label">{{ $t('pages.404.link') }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ROUTES_NAMES } from '../src/paths'
import { useRuntimeConfig, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

// To retrieve config and environment variables
const runtimeConfig = useRuntimeConfig()

useHead({
  titleTemplate: `${t('pages.404.title')} | %s`,
})
</script>
