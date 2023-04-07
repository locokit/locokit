<template>
  <WithAsideNav>
    <template #mini-navigation-items>
      <NuxtLink
        class="nav-link bg-primary text-white"
        :to="{ name: ROUTES_NAMES.ADMIN.USERS.HOME }"
      >
        <button
          v-tooltip="$t('pages.admin.users')"
          type="button"
          class="select-none mx-auto h-12 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary hover:bg-primary-dark p-2"
        >
          <i class="bi bi-person-fill" aria-hidden="true" />
        </button>
      </NuxtLink>
      <NuxtLink
        class="nav-link bg-primary text-white"
        :to="{ name: ROUTES_NAMES.ADMIN.GROUPS.HOME }"
      >
        <button
          v-tooltip="$t('pages.admin.groups')"
          type="button"
          class="select-none mx-auto h-12 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary hover:bg-primary-dark p-2"
        >
          <i class="bi bi-people-fill" aria-hidden="true" />
        </button>
      </NuxtLink>
    </template>
    <template #content>
      <NuxtPage />
    </template>
  </WithAsideNav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ROUTES_NAMES } from '../../paths'
import WithAsideNav from '../../layouts/WithAsideNav.vue'
import { useStoreUsers } from '../../stores/users'
import { onMounted, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const usersStore = useStoreUsers()
const { users } = storeToRefs(usersStore)

// Initialization
if (!users.value) {
  await usersStore.updateUsers()
}

useHead({
  titleTemplate: `${t('pages.admin.title')} | %s`,
})
</script>

<style scoped>
.nav-link.router-link-active {
  @apply bg-primary-lighten text-primary hover:bg-primary hover:text-white;
}
</style>
