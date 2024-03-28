<template>
  <div class="relative flex flex-row h-full">
    <!-- Main content -->
    <main class="flex-1 flex flex-col">
      <slot name="main" />
    </main>

    <!-- Hide/Display button Sidebar -->
    <div
      v-show="
        canClosePanel === false ||
        (isSettingsPanelOpen === false && openPanel !== undefined)
      "
      class="absolute right-0 top-0 m-0.5"
    >
      <PrimeButton
        icon="bi bi-chevron-double-left"
        @click="handleSettingsPanel"
      />
    </div>

    <!-- Panel -->
    <section
      v-show="isSettingsPanelOpen"
      tabindex="-1"
      class="relative flex-1 max-w-md bg-white shadow-xl"
    >
      <div class="flex flex-col h-full mx-2">
        <div class="flex flex-col flex-shrink-0 px-2 py-4">
          <div
            class="absolute -left-0.5 top-0 my-0.5 transform -translate-x-full"
          >
            <PrimeButton
              :icon="canClosePanel ? 'bi bi-x' : 'bi bi-chevron-double-right'"
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
import { ref, watch } from '#imports'

const emit = defineEmits(['update:openPanel'])

const props = withDefaults(
  defineProps<{
    canClosePanel?: boolean | undefined
    openPanel?: boolean | undefined
  }>(),
  {
    canClosePanel: undefined,
    openPanel: undefined,
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
  },
)
</script>
