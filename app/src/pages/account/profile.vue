<template>
  <LayoutHeader>
    <div class="max-w-6xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <div class="flex items-start gap-14">
        <ul class="flex flex-col flex-wrap list-none pl-0 w-4/12">
          <li class="flex-grow text-left">
            <h2 class="mb-4 text-lg font-bold">
              {{ $t('locokit.pages.profile.sectionTitle') }}
            </h2>
          </li>
          <li v-for="link in navLinks" class="group flex-grow text-left border-b last:border-b-0 border-slate-300">
            <RouterLink
              class="block px-5 py-4 hover:bg-slate-300 focus:bg-slate-200"
              :to="{ name: link.routeName }"
            >
              <i class="mr-2 bi" :class="link.iconClass" aria-hidden="true"/>
              <span>{{ link.title }}</span>
            </RouterLink>
          </li>
        </ul>

        <div class="w-full">
          <RouterView/>
        </div>
      </div>
    </div>
  </LayoutHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView } from 'vue-router';
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()
const navLinks = computed(() => [
  {
    routeName: ROUTE_NAMES.ACCOUNT.PROFILE.UPDATE_GENERAL,
    title: t('locokit.pages.profile.updateGeneral'),
    iconClass: 'bi-person-fill-gear',
  },
  {
    routeName: ROUTE_NAMES.ACCOUNT.PROFILE.UPDATE_EMAIL,
    title: t('locokit.pages.profile.updateEmail'),
    iconClass: 'bi-envelope-at-fill',
  },
  {
    routeName: ROUTE_NAMES.ACCOUNT.PROFILE.UPDATE_PASSWORD,
    title: t('locokit.pages.profile.updatePassword'),
    iconClass: 'bi-shield-lock-fill',
  },
])
</script>

<style scoped>
.router-link-exact-active {
  @apply ps-4 font-bold border-l-4 border-secondary bg-slate-200;
}
</style>
