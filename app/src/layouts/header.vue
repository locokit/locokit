<template>
  <div class="flex flex-col h-full">
    <header class="relative min-h-16 h-16 z-10 bg-white w-full shadow-md flex items-center">
      <div class="relative h-full px-4 sm:px-6 lg:px-8 w-full">
        <nav class="h-full flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex w-full items-center justify-between md:w-auto">
              <RouterLink :to="{ name: ROUTE_NAMES.HOME }">
                <span class="sr-only">
                  {{ LCK_SETTINGS.PORTAL_NAME }} - {{ LCK_SETTINGS.PORTAL_TITLE }}
                </span>
                <img
                  alt="Portal logo"
                  class="max-w-[14rem] max-h-[100px]"
                  :src="LCK_SETTINGS.IMAGE_LOGO_URL"
                />
              </RouterLink>
              <div class="-mr-2 flex items-center md:hidden">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-sm bg-white dark:bg-slate-900 p-2 hover:bg-slate-100"
                  aria-expanded="false"
                  @click="toggleMenu"
                >
                  <span class="sr-only">
                    {{ t('locokit.layouts.withHeader.openMenu') }}
                  </span>
                  <i class="bi bi-list text-2xl" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="navLinks && navLinks.length > 0"
            class="hidden md:ml-auto md:flex md:space-x-8 md:flex-row md:items-center md:flex-grow md:justify-end"
          >
            <RouterLink
              v-for="navLink in navLinks"
              :key="navLink.routeName"
              :to="{ name: navLink.routeName }"
              class="nav-link py-1 px-2 min-w-28 text-primary hover:bg-slate-100 flex flex-row items-center justify-center rounded-md"
              :class="navLink.class"
              @click="toggleMenu"
            >
              <i v-if="navLink.icon" :class="'bi ' + navLink.icon" class="mr-2" />
              <p>{{ t('locokit.layouts.withHeader.' + navLink.title) }}</p>
            </RouterLink>
            <button-translate />
          </div>
          <button
            v-if="authState.isAuthenticated"
            type="button"
            class="items-center justify-center bg-white dark:bg-slate-900 p-2 border-b-2 hover:bg-slate-100 hidden md:ml-auto md:inline-flex border-b-transparent"
            @click="onClickLogout"
          >
            <i class="bi bi-door-open-fill mr-2" />
            <p>{{ t('locokit.layouts.withHeader.logout') }}</p>
          </button>
        </nav>
      </div>

      <div
        v-if="menuOpened"
        class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-1 transition md:hidden"
      >
        <div
          class="overflow-hidden rounded-md bg-white dark:bg-slate-900 shadow-md ring-1 ring-black ring-opacity-5"
        >
          <div class="flex items-center justify-between mx-1 mt-1">
            <div>
              <RouterLink class="h-12" :to="{ name: ROUTE_NAMES.HOME }">
                <span class="sr-only">
                  {{ LCK_SETTINGS.PORTAL_NAME }}
                </span>
                <img alt="logo" class="h-12" src="@/assets/logo.png" />
              </RouterLink>
            </div>
            <div class="self-center">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-sm bg-white dark:bg-slate-900 p-2 hover:bg-slate-100"
                @click="toggleMenu"
              >
                <span class="sr-only">
                  {{ t('locokit.layouts.withHeader.closeMenu') }}
                </span>
                <i class="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div v-if="navLinks && navLinks.length > 0" class="space-y-1 px-2 pt-2 pb-3">
            <RouterLink
              v-for="navLink in navLinks"
              :key="navLink.routeName"
              :to="{ name: navLink.routeName }"
              class="block rounded-sm pl-3 py-2 text-base font-medium hover:bg-slate-100 flex flex-row items-center"
              @click="toggleMenu"
            >
              <i v-if="navLink.icon" :class="'bi ' + navLink.icon" class="mr-2" />
              <p>
                {{ t('locokit.layouts.withHeader.' + navLink.title) }}
              </p>
            </RouterLink>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-sm bg-white dark:bg-slate-900 p-2 pl-3 hover:bg-slate-100"
              @click="onClickLogout"
            >
              <i class="bi bi-door-open-fill mr-2" />
              <p>{{ t('locokit.layouts.withHeader.logout') }}</p>
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="grow flex bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { USER_PROFILE } from '@locokit/shared'
import ROUTE_NAMES from '@/router/routes'
import { useStoreAuth } from '@/stores/auth'
import ButtonTranslate from '@/components/button-translate.vue'
import LCK_SETTINGS from '@/config'

const router = useRouter()
const { authState, logout } = useStoreAuth()
const { t } = useI18n()

const menuOpened = ref(false)

const navLinks = computed(() => {
  if (authState.isAuthenticated) {
    if (authState.user?.profile === USER_PROFILE.ADMIN) {
      return [
        {
          routeName: ROUTE_NAMES.WORKSPACE.LIST,
          title: 'workspaces',
          icon: 'bi-person-workspace',
        },
        {
          routeName: ROUTE_NAMES.ADMIN.ROOT,
          title: 'admin',
          icon: 'bi-gear-fill',
        },
        {
          routeName: ROUTE_NAMES.ACCOUNT.PROFILE.ROOT,
          title: 'profile',
          icon: 'bi-person-circle',
        },
      ]
    }
    return [
      {
        routeName: ROUTE_NAMES.WORKSPACE.LIST,
        title: 'workspaces',
      },
      {
        routeName: ROUTE_NAMES.ACCOUNT.PROFILE.ROOT,
        title: 'profile',
        icon: 'bi-person-circle',
      },
    ]
  }
  return [
    {
      routeName: ROUTE_NAMES.WORKSPACE.LIST,
      title: 'workspaces',
    },
    {
      routeName: ROUTE_NAMES.ACCOUNT.SIGN_IN,
      title: 'signIn',
      class: 'bg-secondary',
    },
  ]
})

function toggleMenu() {
  menuOpened.value = !menuOpened.value
}

async function onClickLogout() {
  await logout()
  await router.push({ name: ROUTE_NAMES.HOME })
}
</script>

<style scoped>
.nav-link.router-link-active {
  @apply border-primary text-primary;
  font-weight: bold;
}
</style>
