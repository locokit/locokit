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
          <NuxtLink class="h-16 inline-block" :to="{ name: ROUTES_NAMES.HOME }">
            <span class="sr-only">{{ runtimeConfig.public.PROJECT_NAME }}</span>
            <img alt="logo" class="h-16" src="/assets/logo-mobile-alt.svg" />
          </NuxtLink>
        </div>
        <div class="flex flex-col flex-1 space-y-4">
          <slot name="navMenu" />
        </div>
        <div class="relative flex flex-col flex-shrink-0 border-t">
          <NuxtLink :to="{ name: ROUTES_NAMES.HOME }">
            <PrimeButton icon="pi pi-user" />
          </NuxtLink>
          <PrimeButton icon="pi pi-sign-out" @click="logout" />
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1">
      <slot name="main" />
    </main>

    <!-- Close button Panel -->
    <div
      v-show="canManageClosePanel && !isSettingsPanelOpen"
      class="absolute right-0 top-0 p-2"
    >
      <PrimeButton
        icon="pi pi-angle-double-left"
        @click="handleSettingsPanel"
      />
    </div>

    <!-- Panel -->
    <section
      v-show="isSettingsPanelOpen"
      tabindex="-1"
      class="relative w-full max-w-md bg-white shadow-xl focus:outline-none"
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
          <slot name="panelHeader" />
        </div>
        <div class="flex-1 overflow-hidden hover:overflow-y-auto">
          <slot name="panelContent" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { ROUTES_NAMES } from '../paths'
import { useStoreAuth } from '../stores/auth'
import { computed, ref, useRuntimeConfig, watch } from '#imports'

const runtimeConfig = useRuntimeConfig()
const authStore = useStoreAuth()

const emit = defineEmits(['update:openPanel'])

const props = withDefaults(
  defineProps<{
    canManageClosePanel?: boolean
    openPanel?: boolean
  }>(),
  {
    canManageClosePanel: false,
    openPanel: false,
  },
)

const isSettingsPanelOpen = ref(false)

const handleSettingsPanel = () => {
  isSettingsPanelOpen.value = !isSettingsPanelOpen.value
  emit('update:openPanel', isSettingsPanelOpen.value)
}

watch(
  () => props.openPanel,
  (openPanel) => {
    isSettingsPanelOpen.value = openPanel
    console.log(openPanel, isSettingsPanelOpen.value)
  },
)

// const isPanelOpen = computed(() => {
//   if (!props.canManageClosePanel) {
//     return isSettingsPanelOpen.value || props.openPanel
//   }
//   return isSettingsPanelOpen.value
// })

const logout = () => {
  authStore.logout()
}
</script>

<style scoped lang="scss"></style>
