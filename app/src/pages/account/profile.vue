<template>
  <LayoutHeader>
    <div class="flex items-stretch min-h-full">
      <NavVertical
        :links="navLinks"
        :title="t('locokit.pages.profile.title')"
        class="w-80 border-e border-slate-300"
        title-class="p-4 text-lg font-bold border-b border-slate-300"
      />
      <div class="w-full">
        <RouterView/>
      </div>
    </div>
  </LayoutHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'
import LayoutHeader from '@/layouts/header.vue'
import NavVertical from '@/components/nav-vertical.vue'
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
