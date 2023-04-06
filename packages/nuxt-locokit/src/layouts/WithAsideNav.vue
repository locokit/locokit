<template>
  <div class="relative flex flex-col h-screen overflow-hidden">
    <!-- Brand -->
    <div
      class="w-full px-4 sm:px-6 bg-primary-lighten h-16 border-b-2 border-primary bg-primary-lighten flex"
    >
      <NuxtLink class="h-16 w-[26.75rem]" :to="{ name: ROUTES_NAMES.HOME }">
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

      <div class="flex flex-row w-full justify-end">
        <div class="relative flex justify-center flex-shrink-0 mr-4">
          <NuxtLink
            class="nav-link self-center mr-4"
            :to="{ name: ROUTES_NAMES.WORKSPACE.HOME }"
          >
            <button
              type="button"
              class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-lighten hidden md:ml-auto md:inline-flex"
            >
              <i class="bi bi-person-workspace mr-1" />
              <span> {{ $t('layouts.withAsideNav.workspaces') }}</span>
            </button>
          </NuxtLink>
          <NuxtLink
            class="nav-link self-center mr-4"
            :to="{ name: ROUTES_NAMES.PROFILE.HOME }"
          >
            <button
              type="button"
              class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-lighten hidden md:ml-auto md:inline-flex"
            >
              <i class="bi bi-person-circle mr-1" />
              <span> {{ $t('layouts.withAsideNav.profile') }}</span>
            </button>
          </NuxtLink>
          <NuxtLink
            class="nav-link self-center mr-4"
            :to="{ name: ROUTES_NAMES.ADMIN.HOME }"
          >
            <button
              type="button"
              class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-lighten hidden md:ml-auto md:inline-flex"
            >
              <i class="bi bi-gear-fill mr-1" />
              <span> {{ $t('layouts.withAsideNav.admin') }}</span>
            </button>
          </NuxtLink>
          <button
            type="button"
            class="self-center items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-lighten hidden md:ml-auto md:inline-flex"
            @click="logout"
          >
            <i class="bi bi-door-open-fill mr-1" />
            <span> {{ $t('layouts.withHeader.logout') }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-row h-full">
      <aside
        tabindex="-1"
        class="static flex flex-col flex-shrink-0 bg-primary-lighten focus:outline-none h-full w-14"
      >
        <!-- Mini navigation -->
        <div class="flex flex-row h-full">
          <div class="bg-primary flex flex-col flex-shrink-0 h-full">
            <div class="flex flex-col flex-1 w-14">
              <slot name="mini-navigation-items" />
            </div>
          </div>
        </div>
      </aside>
      <!-- Content -->
      <div class="content-main w-full">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from '../paths'
import { useStoreAuth } from '../stores/auth'
import { useRouter, useRuntimeConfig } from '#imports'

const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const authStore = useStoreAuth()

const logout = async () => {
  await authStore.logout()
  await router.push({
    name: ROUTES_NAMES.HOME,
  })
}
</script>

<style scoped>
.nav-link.router-link-active {
  @apply border-b-secondary border-b-4 font-bold pt-1 rounded;
}

.content-main {
  height: calc(100vh - 4rem);
}
</style>
