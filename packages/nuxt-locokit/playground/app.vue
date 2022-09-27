<template>
  <header class="relative z-10 bg-white lg:w-full shadow-md">
    <div class="relative px-4 py-6 sm:px-6 lg:px-8">
      <nav
        class="relative flex items-center justify-between sm:h-10 lg:justify-start"
        aria-label="Global"
      >
        <div class="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
          <div class="flex w-full items-center justify-between md:w-auto">
            <nuxt-link class="h-16" to="/">
              <span class="sr-only">LocoKit</span>
              <img alt="logo" class="h-16" src="/assets/logo.png" />
            </nuxt-link>
            <div class="-mr-2 flex items-center md:hidden">
              <button
                type="button"
                @click="toggleMenu"
                class="inline-flex items-center justify-center rounded-sm bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
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
        <div class="hidden md:ml-auto md:block md:space-x-8 md:pr-4">
          <nuxt-link
            to="/"
            class="font-medium p-2 rounded-sm text-gray-500 hover:bg-primary hover:text-gray-100"
            >Home</nuxt-link
          >

          <nuxt-link
            to="/w"
            class="font-medium p-2 rounded-sm text-gray-500 hover:bg-primary hover:text-gray-100"
            >Workspaces</nuxt-link
          >

          <nuxt-link
            to="/auth/login"
            class="font-medium p-2 rounded-sm text-primary hover:bg-primary hover:text-gray-100"
            >Log in</nuxt-link
          >
        </div>
      </nav>
    </div>

    <!--
      Mobile menu, show/hide based on menu open state.

      Entering: "duration-150 ease-out"
        From: "opacity-0 scale-95"
        To: "opacity-100 scale-100"
      Leaving: "duration-100 ease-in"
        From: "opacity-100 scale-100"
        To: "opacity-0 scale-95"
    -->
    <div
      class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
      v-if="menuOpened"
    >
      <div
        class="overflow-hidden rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5"
      >
        <div class="flex items-center justify-between px-5 pt-4">
          <div>
            <nuxt-link class="h-8" to="/">
              <span class="sr-only">LocoKit</span>
              <img alt="logo" class="h-8" src="/assets/logo.png" />
            </nuxt-link>
          </div>
          <div class="-mr-2">
            <button
              type="button"
              @click="toggleMenu"
              class="inline-flex items-center justify-center rounded-sm bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span class="sr-only">Close main menu</span>
              <!-- Heroicon name: outline/x-mark -->
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
        <div class="space-y-1 px-2 pt-2 pb-3">
          <nuxt-link
            @click="toggleMenu"
            to="/"
            class="block rounded-sm px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >Home</nuxt-link
          >

          <nuxt-link
            @click="toggleMenu"
            to="/w"
            class="block rounded-sm px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >Workspaces</nuxt-link
          >

          <nuxt-link
            @click="toggleMenu"
            to="/auth/login"
            class="block w-full bg-gray-50 px-5 py-3 text-center font-medium text-primary hover:bg-gray-100"
            >Log in</nuxt-link
          >
        </div>
      </div>
    </div>
  </header>
  <main class="flex grow mt-4">
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
const menuOpened = ref(false)

function toggleMenu() {
  menuOpened.value = !menuOpened.value
}
</script>
