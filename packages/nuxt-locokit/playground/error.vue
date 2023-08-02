<template>
  <div class="h-screen bg-cover bg-no-repeat bg-center">
    <h1>Error</h1>

    <h2>[{{ error.statusCode }}] {{ error.statusMessage }} {{ error.url }}</h2>

    <div
      v-if="error.statusCode === 404"
      class="container mx-auto text-center justify-center flex-1"
      :style="{
        background:
          'bottom center / contain no-repeat url' +
          '(' +
          runtimeConfig.public.ERROR_BACKGROUND_IMAGE_URL +
          ')' +
          'var(--primary-color)',
      }"
    >
      <span class="text-white pt-8 mb-2 text-3xl text-9xl font-black sr-only"
        >404</span
      >
      <h1 class="text-white pt-8 mb-2 text-3xl font-bold tracking-tight">
        {{ t('pages.error.404.title') }}
      </h1>
      <h2 class="text-white pt-4 text-xl font-bold tracking-tight">
        {{ t('pages.error.404.alternativeTitle') }}
      </h2>
    </div>

    <code v-html="error.message.replaceAll('\n', '<br>')" />

    <div class="container mx-auto text-center justify-center flex-1">
      <NuxtLink
        :to="{ name: ROUTES_NAMES.HOME }"
        class="inline-block mt-4 p-component bg-green-600 hover:bg-green-800 text-white rounded-lg p-4 cursor-pointer ease-out hover:ease-in duration-500 border-solid border border-green-800"
      >
        <span
          class="bi bi-house-fill p-button-icon p-button-icon-left px-2"
          aria-hidden="true"
        ></span>
        <span class="p-button-label">{{ t('pages.error.link') }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ROUTES_NAMES } from '#build/locokit-paths'
import { useRuntimeConfig, useHead, useError } from '#imports'

const error = useError() as Ref<{
  url: string
  statusCode: number
  statusMessage: string
  message: string
  description: string
  data?: any
}>

const { t } = useI18n({ useScope: 'global' })

// To retrieve config and environment variables
const runtimeConfig = useRuntimeConfig()

let titleTemplate = t('pages.error.defaultTitle')
switch (error.value.statusCode) {
  case 404:
    titleTemplate = t('pages.error.404.title')
    break
}

useHead({
  titleTemplate: `${titleTemplate} | %s`,
})
</script>
