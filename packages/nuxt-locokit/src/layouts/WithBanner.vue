<template>
  <div>
    <header class="relative z-10 bg-white lg:w-full shadow-md">
      <div class="relative px-4 py-6 sm:px-6 lg:px-8">
        <nav
          class="relative flex items-center justify-between sm:h-10 lg:justify-start"
          aria-label="Global"
        >
          <div class="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
            <div class="flex w-full items-center justify-between md:w-auto">
              <NuxtLink class="h-16" :to="{ name: ROUTES_NAMES.HOME }">
                <span class="sr-only">
                  { runtimeConfig.public.PROJECT_NAME }}
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
                    {{ $t('layouts.withBanner.openMenu') }}
                  </span>
                  <!-- Heroicon name: outline/bars-3 -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="navlinks && navlinks.length > 0"
            class="hidden md:ml-auto md:flex md:space-x-8 md:pr-4 md:flex-row"
          >
            <NuxtLink
              v-for="navlink in navlinks"
              :key="navlink.routeName"
              :to="{ name: navlink.routeName }"
              class="font-medium p-2 rounded text-gray-500 hover:bg-primary hover:text-gray-100 flex flex-row items-center"
              @click="toggleMenu"
            >
              <i
                v-if="navlink.icon"
                :class="'pi ' + navlink.icon"
                class="mr-1"
              />
              <p>{{ $t('layouts.withBanner.' + navlink.title) }}</p>
            </NuxtLink>
          </div>
        </nav>
      </div>

      <div
        v-if="menuOpened"
        class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
      >
        <div
          class="overflow-hidden rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5"
        >
          <div class="flex items-center justify-between px-5 pt-4">
            <div>
              <NuxtLink class="h-8" to="/">
                <span class="sr-only">LocoKit</span>
                <img alt="logo" class="h-8" src="/assets/logo.png" />
              </NuxtLink>
            </div>
            <div class="-mr-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-sm bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                @click="toggleMenu"
              >
                <span class="sr-only">
                  {{ $t('layouts.withBanner.closeMenu') }}
                </span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            v-if="navlinks && navlinks.length > 0"
            class="space-y-1 px-2 pt-2 pb-3"
          >
            <NuxtLink
              v-for="navlink in navlinks"
              :key="navlink.routeName"
              :to="{ name: navlink.routeName }"
              class="block rounded-sm px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex flex-row items-center"
              @click="toggleMenu"
            >
              <i
                v-if="navlink.icon"
                :class="'pi ' + navlink.icon"
                class="mr-1"
              />
              <p>{{ $t('layouts.withBanner.' + navlink.title) }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ROUTES_NAMES } from '../paths'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    navlinks?: {
      routeName: string
      title: string
      icon: string | null
    }[]
  }>(),
  {
    navlinks: () => [],
  },
)

const menuOpened = ref(false)

function toggleMenu() {
  menuOpened.value = !menuOpened.value
}
</script>
