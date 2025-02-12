<template>
  <LayoutHeader>
    <div class="max-w-6xl mx-auto mt-8 pb-4 px-4 lg:px-0">
      <div class="flex items-start gap-14">
        <NavVertical
          :title="t('locokit.pages.admin.title')"
          :links="navLinks"
          class="w-4/12"
        />
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
import { useHead } from '@unhead/vue'
import { useStoreUsers } from '@/stores/users'
import LayoutHeader from '@/layouts/header.vue'
import NavVertical from '@/components/nav-vertical.vue'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

const navLinks = computed(() => [
  {
    routeName: ROUTE_NAMES.ADMIN.USERS.CREATE,
    title: t('locokit.pages.admin.users'),
    iconClass: 'bi-person-fill',
  },
  {
    routeName: ROUTE_NAMES.ADMIN.GROUPS.CREATE,
    title: t('locokit.pages.admin.groups'),
    iconClass: 'bi-people-fill',
  },
])
</script>
