<template>
  <LayoutHeader>
    <div class="flex flex-col w-full lg:max-w-7xl mx-auto">
      <section class="w-full flex flex-col items-center justify-center mx-auto h-[30rem] p-8">
        <h1 class="text-7xl text-center mb-4 font-semibold tracking-tight">
          The
          <span class="text-primary">Low Code </span>
          <span class="text-secondary">Kit</span>
          platform
        </h1>
        <p class="mt-3 text-base sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
          {{ t('locokit.pages.indexPage.presentation') }}
        </p>
      </section>
      <section class="sm:text-center lg:text-left m-4 h-[300px] bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          <span class="block">
            {{ t('locokit.pages.indexPage.buildData') }}
          </span>
          <span class="block text-secondary">
            {{ t('locokit.pages.indexPage.shareSecurely') }}
          </span>
        </h1>
        <p
          class="mt-6 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:ml-0"
        >
          {{ t('locokit.pages.indexPage.createDatabase') }}
        </p>
      </section>
      <section class="sm:text-center lg:text-right m-4 h-[300px] bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          <span class="block">
            {{ t('locokit.pages.indexPage.shareData') }}
          </span>
          <span class="block text-secondary">
            {{ t('locokit.pages.indexPage.craftingApp') }}
          </span>
        </h1>
        <p
          class="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mr-0"
        >
          {{ t('locokit.pages.indexPage.afterBuilding') }}
        </p>
      </section>
      <section class="sm:text-center lg:text-left m-4 h-[300px] bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          <span class="block">{{ t('locokit.pages.indexPage.createWorkflows') }}</span>
          <span class="block text-secondary">
            {{ t('locokit.pages.indexPage.automateProcess') }}
          </span>
        </h1>
        <p
          class="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:ml-0"
        >
          {{ t('locokit.pages.indexPage.createDatabase') }}
        </p>
      </section>
      <section class="sm:text-center lg:text-center mx-auto mb-10">
        <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div class="rounded-md shadow">
            <a
              href="#"
              class="flex w-full items-center justify-center rounded-md border border-transparent bg-secondary px-8 py-3 text-base font-medium text-white hover:bg-primary md:py-4 md:px-10 md:text-lg"
            >
              {{ t('locokit.pages.indexPage.getStarted') }}
            </a>
          </div>
          <div class="mt-3 sm:mt-0 sm:ml-3">
            <a
              href="#"
              class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-primary font-medium text-primary hover:bg-indigo-200 md:py-4 md:px-10 md:text-lg"
            >
              {{ t('locokit.pages.indexPage.liveDemo') }}
            </a>
          </div>
        </div>
      </section>
    </div>
  </LayoutHeader>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'
import { useI18n } from 'vue-i18n'

definePage({
  name: ROUTE_NAMES.HOME,
})

const { t } = useI18n()
</script>
