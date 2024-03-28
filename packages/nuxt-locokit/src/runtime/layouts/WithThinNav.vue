<template>
  <div class="relative flex h-screen">
    <aside
      tabindex="-1"
      class="static flex flex-shrink-0 overflow-hidden bg-white border-r focus:outline-none"
    >
      <!-- Nav -->
      <div
        class="bg-primary flex flex-col flex-shrink-0 h-full px-2 py-4 border-r"
      >
        <!-- Logo -->
        <div class="flex-shrink-0 mb-4">
          <NuxtLink
            class="h-16 inline-block exactActiveClass"
            :to="{ name: ROUTES_NAMES.HOME }"
          >
            <span class="sr-only">{{ runtimeConfig.public.PROJECT_NAME }}</span>
            <img alt="logo" class="h-16" src="/assets/logo-mobile-alt.svg" />
          </NuxtLink>
        </div>
        <div class="flex flex-col flex-1 space-y-4">
          <slot name="navMenu" />
        </div>
        <div class="relative flex flex-col flex-shrink-0 border-t">
          <NuxtLink :to="{ name: ROUTES_NAMES.PROFILE.HOME }">
            <PrimeButton icon="bi bi-person-fill" />
          </NuxtLink>
          <PrimeButton icon="bi bi-door-open-fill" @click="logout" />
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1">
      <slot name="main" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from '../locokit-paths'
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
