<template>
  <div class="flex flex-col">
    <header
      class="relative h-16 z-10 bg-white dark:bg-slate-900 lg:w-full shadow-md dark:border-b dark:border-white"
    >
      <div class="relative h-full items-center px-4 sm:px-6 lg:px-8">
        <nav class="h-full flex items-center justify-between">
          <div class="flex flex-shrink-0 flex-grow items-center">
            <div class="flex w-full items-center justify-between md:w-auto">
              <RouterLink :to="{ name: ROUTE_NAMES.HOME }">
                <span class="sr-only">
                  {{ settings.PORTAL_NAME }}
                </span>
                <img
                  alt="logo"
                  class="max-w-[14rem] max-h-[4rem]"
                  :src="settings.LOGO_BG_PRIMARY_URL"
                />
              </RouterLink>
              <div class="-mr-2 flex items-center md:hidden">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-sm bg-white dark:bg-slate-900 p-2 hover:bg-primary"
                  aria-expanded="false"
                  @click="toggleMenu"
                >
                  <span class="sr-only">
                    {{ $t('locokit.layouts.withHeader.openMenu') }}
                  </span>
                  <i class="bi bi-list" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="navLinks && navLinks.length > 0"
            class="hidden md:ml-auto md:flex md:space-x-8 md:pr-8 md:flex-row"
          >
            <button-translate />
            <RouterLink
              v-for="navLink in navLinks"
              :key="navLink.routeName"
              :to="{ name: navLink.routeName }"
              class="nav-link p-2 hover:bg-primary flex flex-row items-center border-b-2 rounded-t border-b-transparent"
              @click="toggleMenu"
            >
              <i v-if="navLink.icon" :class="'bi ' + navLink.icon" class="mr-1" />
              <p>{{ $t('locokit.layouts.withHeader.' + navLink.title) }}</p>
            </RouterLink>
          </div>
          <button
            v-if="authState.isAuthenticated"
            type="button"
            class="items-center justify-center bg-white dark:bg-slate-900 p-2 border-b-2 hover:bg-primary hidden md:ml-auto md:inline-flex border-b-transparent"
            @click="onClickLogout"
          >
            <i class="bi bi-door-open-fill mr-1" />
            <span> {{ $t('locokit.layouts.withHeader.logout') }}</span>
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
                  {{ settings.PORTAL_NAME }}
                </span>
                <img alt="logo" class="h-12" src="@/assets/logo.png" />
              </RouterLink>
            </div>
            <div class="self-center">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-sm bg-white dark:bg-slate-900 p-2 hover:bg-primary"
                @click="toggleMenu"
              >
                <span class="sr-only">
                  {{ $t('locokit.layouts.withHeader.closeMenu') }}
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
              class="block rounded-sm pl-3 py-2 text-base font-medium hover:bg-primary flex flex-row items-center"
              @click="toggleMenu"
            >
              <i v-if="navLink.icon" :class="'bi ' + navLink.icon" class="mr-1" />
              <p>
                {{ $t('locokit.layouts.withHeader.' + navLink.title) }}
              </p>
            </RouterLink>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-sm bg-white dark:bg-slate-900 p-2 pl-3 hover:bg-primary"
              @click="logout"
            >
              <i class="bi bi-door-open-fill mr-1" />
              {{ $t('locokit.layouts.withHeader.logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>
    <div class="content-main bg-slate-100 dark:bg-slate-900 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { USER_PROFILE } from '@locokit/definitions'
import ROUTE_NAMES from '@/router/routes'
import { useStoreAuth } from '@/stores/auth'
import ButtonTranslate from '@/components/button-translate.vue'

const router = useRouter()
const { authState, logout } = useStoreAuth()

const menuOpened = ref(false)

const settings = {
  PORTAL_NAME: 'LocoKit',
  LOGO_BG_PRIMARY_URL: '/logo.png',
}

const navLinks = computed(() => {
  if (authState.isAuthenticated) {
    if (authState.user?.profile === USER_PROFILE.ADMIN) {
      return [
        {
          routeName: ROUTE_NAMES.HOME,
          title: 'home',
          icon: 'bi-house',
        },
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
        routeName: ROUTE_NAMES.HOME,
        title: 'home',
        icon: 'bi-house',
      },
      {
        routeName: ROUTE_NAMES.WORKSPACE.LIST,
        title: 'workspaces',
        icon: 'bi-person-workspace',
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
      routeName: ROUTE_NAMES.HOME,
      title: 'home',
      icon: 'bi-house',
    },
    {
      routeName: ROUTE_NAMES.WORKSPACE.LIST,
      title: 'workspaces',
      icon: 'bi-person-workspace',
    },
    {
      routeName: ROUTE_NAMES.ACCOUNT.SIGN_IN,
      title: 'signIn',
      icon: 'bi-person-badge',
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
  @apply border-secondary text-secondary;
}

.content-main {
  height: calc(100vh - 4rem);
}
</style>
