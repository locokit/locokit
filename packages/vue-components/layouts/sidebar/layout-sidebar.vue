<template>
  <div class="h-full flex stretch">
    <aside
      v-if="!isRetracted"
      class="w-full lg:w-80 lg:min-w-80 bg-surface-100 text-primary flex flex-col"
    >
      <header class="min-h-12 h-12 flex items-center justify-between border-b-2 border-white">
        <slot name="sidebar-title">
          <h3 class="px-3">Sidebar Header</h3>
        </slot>
        <section class="flex items-center gap-4 text-xl pr-3">
          <button @click="closeSidebar" aria-label="Close sidebar" title="Close sidebar">
            <i class="bi bi-layout-sidebar"></i>
          </button>
          <button
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            aria-label="User menu"
            title="User menu"
          >
            <i class="bi bi-person-circle"></i>
          </button>
          <slot name="user-menu" :set-menu-ref="setMenuRef">
            <PrimeMenu ref="menu" id="overlay_menu" :model="defaultMenuItems" :popup="true">
              <template #item="{ item, props }">
                <a :href="item.route" v-bind="props.action">
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </a>
              </template>
            </PrimeMenu>
          </slot>
        </section>
      </header>
      <nav class="grow overflow-auto relative scroll-shadows" title="Sidebar navigation">
        <slot name="sidebar-nav" :openSidebar="openSidebar" :closeSidebar="closeSidebar">
          <div class="p-3">Here goes your navigation menu.</div>
        </slot>
      </nav>
      <footer class="p-2 flex gap-2 justify-center items-center border-t border-white">
        {{ t('locokit.layouts.sidebar.poweredBy') }}
        <img :src="locokitLogoUrl" alt="Locokit" class="inline-flex w-28" />
        v1.x
      </footer>
    </aside>
    <main
      class="lg:flex flex-col grow overflow-hidden"
      :class="{ flex: isRetracted, hidden: !isRetracted }"
    >
      <header class="min-h-12 h-12 flex gap-2 items-center px-3 text-primary">
        <button @click="openSidebar" v-if="isRetracted">
          <i class="bi bi-layout-sidebar text-xl"></i>
        </button>
        <slot name="breadcrumb">
          <nav>Breadcrumb</nav>
        </slot>
      </header>
      <div class="grow bg-gray-200 text-primary relative overflow-hidden">
        <!-- Background blured -->
        <div
          class="blur-[2px] absolute top-0 left-0 w-full h-full bg-center bg-no-repeat opacity-10 pointer-events-none"
          :style="{
            'background-image': `url('${workspaceLogoUrl}')`,
            'background-size': 'min(80%, 800px)',
          }"
        />
        <slot :openSidebar="openSidebar" :closeSidebar="closeSidebar">
          <h2>Sidebar Content</h2>
        </slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PrimeMenu from 'primevue/menu'

const { t } = useI18n()

defineProps({
  locokitLogoUrl: {
    type: String,
    default: '/logo.png',
  },
  workspaceLogoUrl: {
    type: String,
    default: '/logo.png',
  },
})

/**
 * Handle the sidebar
 */
const isRetracted = ref(false)
function openSidebar() {
  isRetracted.value = false
}
function closeSidebar() {
  isRetracted.value = true
}

/**
 * User menu
 */
const defaultMenuItems = [
  {
    label: 'Administration',
    items: [
      {
        label: 'Platform settings',
        icon: 'pi pi-plus',
        route: '/admin/',
      },
    ],
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        route: '/user/settings',
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        route: '/user/logout',
      },
    ],
  },
]
const menu = ref()
function setMenuRef(ref: InstanceType<typeof PrimeMenu>) {
  menu.value = ref
}
function toggle(event: MouseEvent) {
  menu.value.toggle(event)
}
</script>
