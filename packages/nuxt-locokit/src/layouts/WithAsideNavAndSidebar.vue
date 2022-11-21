<template>
  <div class="relative flex h-screen">
    <aside
      tabindex="-1"
      class="static flex flex-shrink-0 overflow-hidden bg-white border-r focus:outline-none"
    >
      <!-- Mini navigation -->
      <div
        class="bg-primary flex flex-col flex-shrink-0 h-full px-2 py-4 border-r"
      >
        <!-- Brand -->
        <div class="flex-shrink-0">
          <NuxtLink class="h-16 inline-block" :to="{ name: ROUTES_NAMES.HOME }">
            <span class="sr-only">{{ runtimeConfig.public.PROJECT_NAME }}</span>
            <img alt="logo" class="h-16" src="/assets/logo-mobile-alt.svg" />
          </NuxtLink>
        </div>
        <div class="flex flex-col flex-1 space-y-4">
          <slot name="mini-navigation-items" />
        </div>
        <div class="relative flex justify-center flex-shrink-0 border-t">
          <NuxtLink :to="{ name: ROUTES_NAMES.HOME }">
            <PrimeButton icon="pi pi-user" />
          </NuxtLink>
          <PrimeButton icon="pi pi-sign-out" @click="logout" />
        </div>
      </div>

      <!-- nav links -->
      <nav
        class="flex-1 w-64 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto"
      >
        <slot name="sidebar-links" />
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1">
      <slot name="main" />
    </main>

    <!-- Close button Sidebar -->
    <div v-show="isSettingsPanelOpen" class="absolute right-0 top-0 p-2">
      <PrimeButton
        icon="pi pi-angle-double-left"
        @click="handleSettingsPanel"
      />
    </div>

    <!-- Sidebar -->
    <section
      v-show="!isSettingsPanelOpen"
      tabindex="-1"
      class="relative w-full max-w-xs bg-white shadow-xl focus:outline-none"
    >
      <div class="flex flex-col h-screen">
        <div
          class="flex flex-col items-center justify-center flex-shrink-0 px-4 py-8 space-y-4 border-b"
        >
          <div class="absolute left-0 p-2 transform -translate-x-full">
            <PrimeButton
              icon="pi pi-angle-double-right"
              @click="handleSettingsPanel"
            />
          </div>
          <slot name="panel-header" />
        </div>
        <div class="flex-1 overflow-hidden hover:overflow-y-auto">
          <slot name="panel-content" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { ROUTES_NAMES } from '../paths'
import { useStoreAuth } from '../stores/auth'
import { ref, useRuntimeConfig } from '#imports'

const runtimeConfig = useRuntimeConfig()
const authStore = useStoreAuth()

const isSettingsPanelOpen = ref(false)

const handleSettingsPanel = () =>
  (isSettingsPanelOpen.value = !isSettingsPanelOpen.value)

const logout = () => {
  authStore.logout()
}
</script>

<style scoped lang="scss"></style>
