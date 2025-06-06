<template>
  <LayoutHeader>
    <div class="flex flex-col grow">
      <div class="grow flex items-center justify-center h-full w-full mx-auto max-w-[1320px]">
        <section class="w-full lg:w-2/5 flex flex-col items-center mx-auto h-[30rem] p-8">
          <h1 class="text-6xl mb-4 font-medium flex flex-col gap-4">
            The<br />
            <span class="drop-shadow-xl whitespace-nowrap">
              <span class="text-primary">Low Code </span>
              <span class="text-secondary">Kit</span>
            </span>
            <br />
            platform
          </h1>
          <p class="my-3 text-base mt-5 sm:text-lg md:mt-5 md:text-xl">
            {{ t('locokit.pages.indexPage.presentation') }}
          </p>
          <RouterLink
            :to="{ name: ROUTE_NAMES.ACCOUNT.SIGN_IN }"
            class="nav-link py-1 px-2 min-w-28 text-primary hover:bg-slate-100 flex flex-row items-center justify-center rounded-md bg-secondary"
          >
            {{ t('locokit.layouts.withHeader.signIn') }}
          </RouterLink>
        </section>
        <section class="w-full lg:w-3/5 flex items-center mx-auto p-8">
          <img alt="Portal logo" class="w-full drop-shadow-xl" :src="LCK_SETTINGS.IMAGE_LOGO_URL" />
        </section>
        <!-- <section class="sm:text-center lg:text-left m-4 h-[300px] bg-white rounded-lg shadow-lg p-8">
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
      </section> -->
      </div>
      <footer class="bg-white border-t h-12 min-h-12 flex items-center justify-center">
        <a
          href="https://makina-corpus.com?utm_source=locokit&utm_medium=next-saas"
          class="text-sm"
          target="_blank"
        >
          © Makina Corpus - Autonomens
        </a>
      </footer>
    </div>
  </LayoutHeader>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'
import { useI18n } from 'vue-i18n'
import LCK_SETTINGS from '@/config'

definePage({
  name: ROUTE_NAMES.HOME,
})

const { t } = useI18n()
</script>
