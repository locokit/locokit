<template>
  <div class="h-full flex flex-col">
    <header class="relative z-10 bg-white lg:w-full shadow-md">
      <div class="relative px-4 py-6 sm:px-6 lg:px-8">
        <nav
          class="relative flex items-center justify-between sm:h-10 lg:justify-start"
        >
          <div class="flex flex-shrink-0 flex-grow items-center">
            <div class="flex w-full items-center justify-between md:w-auto">
              <NuxtLink class="h-16" :to="{ name: ROUTES_NAMES.HOME }">
                <span class="sr-only">
                  {{ runtimeConfig.public.PROJECT_NAME }}
                </span>
                <img alt="logo" class="h-16" src="/assets/logo.png" />
              </NuxtLink>
              <div class="-mr-2 flex items-center md:hidden">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-sm bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded="false"
                  @click="toggleMenu"
                >
                  <span class="sr-only">
                    {{ $t('layouts.withHeader.openMenu') }}
                  </span>
                  <i class="bi bi-list" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="navLinks && navLinks.length > 0"
            class="hidden md:ml-auto md:flex md:space-x-8 md:pr-4 md:flex-row"
          >
            <NuxtLink
              v-for="navLink in navLinks"
              :key="navLink.routeName"
              :to="{ name: navLink.routeName }"
              class="nav-link font-medium p-2 rounded text-gray-500 hover:bg-primary hover:text-gray-100 flex flex-row items-center"
              @click="toggleMenu"
            >
              <i
                v-if="navLink.icon"
                :class="'bi ' + navLink.icon"
                class="mr-1"
              />
              <p>
                {{ $t('layouts.withHeader.' + navLink.title) }}
              </p>
            </NuxtLink>
          </div>
          <button
            v-if="isAuthenticated"
            type="button"
            class="items-center justify-center rounded bg-white p-2 text-gray-500 hover:bg-primary hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hidden md:ml-auto md:inline-flex"
            @click="logout"
          >
            <i class="bi bi-door-open-fill mr-1" />
            <span> {{ $t('layouts.withHeader.logout') }}</span>
          </button>
        </nav>
      </div>

      <div
        v-if="menuOpened"
        class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-1 transition md:hidden"
      >
        <div
          class="overflow-hidden rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5"
        >
          <div class="flex items-center justify-between px-5 pt-4">
            <div>
              <NuxtLink class="h-8" to="/">
                <span class="sr-only">
                  {{ runtimeConfig.public.PROJECT_NAME }}
                </span>
                <img alt="logo" class="h-12" src="/assets/logo.png" />
              </NuxtLink>
            </div>
            <div class="-mr-4 mt-4 self-center">
              <button
                type="button"
                class="items-center justify-center rounded bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                @click="toggleMenu"
              >
                <span class="sr-only">
                  {{ $t('layouts.withHeader.closeMenu') }}
                </span>
                <i class="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            v-if="navLinks && navLinks.length > 0"
            class="space-y-1 px-2 pt-2 pb-3"
          >
            <NuxtLink
              v-for="navLink in navLinks"
              :key="navLink.routeName"
              :to="{ name: navLink.routeName }"
              class="block rounded-sm pl-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-500 hover:text-gray-900 flex flex-row items-center"
              @click="toggleMenu"
            >
              <i
                v-if="navLink.icon"
                :class="'bi ' + navLink.icon"
                class="mr-1"
              />
              <p>
                {{ $t('layouts.withHeader.' + navLink.title) }}
              </p>
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-sm bg-white p-2 pl-3 text-gray-700 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              @click="logout"
            >
              <i class="bi bi-door-open-fill mr-1" />
              {{ $t('layouts.withHeader.logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>
    <div class="h-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { PROFILE } from '@locokit/definitions'
import { ROUTES_NAMES } from '../paths'
import { useStoreAuth } from '../stores/auth'
import { computed, useRouter, useRuntimeConfig } from '#imports'

const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const authStore = useStoreAuth()

const { isAuthenticated, user } = storeToRefs(authStore)

const menuOpened = ref(false)

const navLinks = computed(() => {
  const mainLinks = [
    {
      routeName: ROUTES_NAMES.HOME,
      title: 'home',
      icon: 'bi-house',
    },
    {
      routeName: ROUTES_NAMES.WORKSPACE.HOME,
      title: 'workspaces',
      icon: 'bi-person-workspace',
    },
  ]
  if (isAuthenticated.value) {
    const authen = [
      ...mainLinks,
      {
        routeName: ROUTES_NAMES.PROFILE.HOME,
        title: 'profile',
        icon: 'bi-person-circle',
      },
    ]
    if (user.value?.profile === PROFILE.ADMIN) {
      return [
        ...authen,
        {
          routeName: ROUTES_NAMES.ADMIN.HOME,
          title: 'admin',
          icon: 'bi-gear-fill',
        },
      ]
    }
    return authen
  }
  return [
    ...mainLinks,
    {
      routeName: ROUTES_NAMES.AUTH.SIGN_IN,
      title: 'signIn',
      icon: 'bi-person-badge',
    },
    {
      routeName: ROUTES_NAMES.AUTH.SIGN_UP,
      title: 'signUp',
      icon: 'bi-person-plus-fill',
    },
  ]
})

const toggleMenu = () => {
  menuOpened.value = !menuOpened.value
}

const logout = async () => {
  await authStore.logout()
  await router.push({
    name: ROUTES_NAMES.HOME,
  })
}
</script>

<style scoped>
.nav-link.router-link-active {
  @apply border-primary border font-bold;
}
</style>
