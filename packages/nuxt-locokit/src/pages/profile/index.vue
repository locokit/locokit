<template>
  <WithBanner>
    <div class="max-w-6xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <div class="flex items-start">
        <ul class="flex flex-col flex-wrap list-none border-b-0 pl-0">
          <li class="flex-grow text-left">
            <h3>
              {{ $t('pages.profile.title') }}
            </h3>
          </li>
          <li class="flex-grow text-left">
            <NuxtLink
              class="nav-link block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
              :to="{ name: ROUTES_NAMES.PROFILE.UPDATE_USERNAME }"
            >
              <i class="pi pi-user mr-2" aria-hidden="true" />
              <span>{{ $t('pages.profile.general') }}</span>
            </NuxtLink>
          </li>
          <li class="flex-grow text-left">
            <NuxtLink
              class="nav-link block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
              :to="{ name: ROUTES_NAMES.PROFILE.UPDATE_EMAIL }"
            >
              <i class="pi pi-envelope mr-2" aria-hidden="true" />
              <span>{{ $t('pages.profile.updateEmail') }}</span>
            </NuxtLink>
          </li>
          <li class="flex-grow text-left">
            <NuxtLink
              class="nav-link block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
              :to="{ name: ROUTES_NAMES.PROFILE.UPDATE_PASSWORD }"
            >
              <i class="pi pi-lock mr-2" aria-hidden="true" />
              <span>{{ $t('pages.profile.updatePassword') }}</span>
            </NuxtLink>
          </li>
        </ul>

        <div class="w-full pl-8">
          <NuxtPage />
        </div>
      </div>
    </div>
  </WithBanner>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WithBanner from '../../layouts/WithBanner.vue'
import { ROUTES_NAMES } from '../../paths'
import { useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

useHead({
  titleTemplate: `${t('pages.profile.title')} | %s`,
})
</script>

<style scoped>
.nav-link.router-link-exact-active {
  @apply font-bold bg-gray-100;
  border-left: var(--primary-color) 4px solid;
}
</style>
