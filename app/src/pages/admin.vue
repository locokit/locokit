<template>
  <LayoutHeader>
    <div class="flex items-stretch min-h-full">
      <NavVertical
        :links="navLinks"
        :title="t('locokit.pages.admin.title')"
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
import LayoutHeader from '@/layouts/header.vue'
import NavVertical from '@/components/nav-vertical.vue'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

const navLinks = computed(() => [
  {
    routeName: ROUTE_NAMES.ADMIN.USERS.ROOT,
    title: t('locokit.pages.admin.users'),
    iconClass: 'bi-person-fill',
  },
  {
    routeName: ROUTE_NAMES.ADMIN.GROUPS.ROOT,
    title: t('locokit.pages.admin.groups'),
    iconClass: 'bi-people-fill',
  },
])
</script>
