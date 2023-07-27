<template>
  <WithAsideNav>
    <template #header-insert>
      <NuxtLink
        :to="{ name: ROUTES_NAMES.HOME }"
        class="px-4 sm:px-6 lg:px-8"
        tabindex="0"
      >
        <span class="sr-only">
          {{ runtimeConfig.public.PROJECT_NAME }}
        </span>
        <img
          class="max-w-[14rem] max-h-[4rem]"
          alt="logo"
          :src="runtimeConfig.public.LOGO_BG_PRIMARY_URL"
          aria-hidden="true"
        />
      </NuxtLink>
    </template>
    <template #header-items>
      <NuxtLink
        class="nav-link self-center mr-4"
        :to="{ name: ROUTES_NAMES.WORKSPACE.WORKSPACES }"
        tabindex="0"
      >
        <button
          tabindex="-1"
          type="button"
          class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-lighten hidden md:ml-auto md:inline-flex"
        >
          <i class="bi bi-person-workspace mr-1" />
          <span> {{ $t('layouts.withAsideNav.workspaces') }}</span>
        </button>
      </NuxtLink>
      <NuxtLink
        class="nav-link self-center mr-4"
        :to="{ name: ROUTES_NAMES.ADMIN.HOME }"
        tabindex="0"
      >
        <button
          tabindex="-1"
          type="button"
          class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:border focus:border-primary hidden md:ml-auto md:inline-flex"
        >
          <i class="bi bi-gear-fill mr-1" />
          <span> {{ $t('layouts.withAsideNav.admin') }}</span>
        </button>
      </NuxtLink>
    </template>
    <template #mini-navigation-items>
      <NuxtLink
        tabindex="0"
        class="mini-nav-link bg-primary text-white focus-visible:outline-none focus:border focus:border-primary-lighten"
        :to="{ name: ROUTES_NAMES.ADMIN.USERS.HOME }"
      >
        <button
          v-tooltip="$t('pages.admin.users')"
          tabindex="-1"
          type="button"
          class="mx-auto h-12 w-full hover:bg-primary-dark p-2"
        >
          <i class="bi bi-person-fill" aria-hidden="true" />
        </button>
      </NuxtLink>
      <NuxtLink
        tabindex="0"
        class="mini-nav-link bg-primary text-white focus-visible:outline-none focus:border focus:border-primary-lighten"
        :to="{ name: ROUTES_NAMES.ADMIN.GROUPS.HOME }"
      >
        <button
          v-tooltip="$t('pages.admin.groups')"
          tabindex="-1"
          type="button"
          class="mx-auto h-12 w-full hover:bg-primary-dark p-2"
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
import { useHead, useRuntimeConfig } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const runtimeConfig = useRuntimeConfig()

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
  @apply border-b-secondary border-b-4 font-bold pt-1 rounded;
}

.mini-nav-link.router-link-active {
  @apply bg-primary-lighten text-primary hover:bg-primary hover:text-white focus:border-primary;
}
</style>
