<template>
  <WithAsideNav>
    <template #header-insert>
      <Toast />
      <div class="w-14 h-full mx-0.5" />
      <div v-if="currentWorkspace" class="dropdown-wrapper relative my-auto">
        <button
          class="w-max py-2 px-4 rounded transition duration-300 items-center justify-center rounded bg-transparent text-lck [&:not(.disabled)]hover:bg-primary [&:not(.disabled)]hover:text-gray-100 focus:border focus:border-primary hidden md:ml-auto md:inline-flex font-bold"
          :class="{ 'border border-primary': showWorkspaces }"
          :disabled="!workspaces"
          @click.stop="showWorkspaces = !showWorkspaces"
        >
          <span>{{ currentWorkspace.name }}</span>
          <i
            v-if="workspaces && workspaces.total > 1"
            class="bi bi-chevron-compact-down ml-2"
          />
        </button>
        <transition name="fade">
          <div
            v-if="showWorkspaces && workspaces && workspaces.total > 0"
            class="dropdown-menu text-white mt-1 rounded absolute z-10 shadow-lg w-40 max-w-xs bg-primary-lighten"
          >
            <ul
              class="list-none overflow-hidden rounded border border-primary"
              @click.stop
            >
              <li
                v-for="workspace in workspaces.data"
                :key="workspace.slug"
                class="[&:not(.selected)]:hover:bg-slate-200"
                :class="{
                  selected: workspace.id === currentWorkspace.id,
                }"
              >
                <NuxtLink
                  class="flex py-2 px-4 transition duration-300"
                  :to="{
                    name: ROUTES_NAMES.WORKSPACE.HOME,
                    params: {
                      workspaceSlug: workspace.slug,
                    },
                  }"
                >
                  {{ workspace.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div v-else class="flex-none my-auto">
        <span> {{ $t('pages.workspace.noResult') }}</span>
      </div>
    </template>
    <template #mini-navigation-items>
      <NuxtLink
        v-for="link in MINI_NAV"
        :key="link.routeName"
        tabindex="0"
        class="mini-nav-link bg-primary text-white focus-visible:outline-none focus:border focus:border-primary-lighten"
        :to="{ name: link.routeName }"
      >
        <button
          v-tooltip="$t(link.nameTK)"
          tabindex="-1"
          type="button"
          class="select-none mx-auto h-12 w-full hover:bg-primary-dark p-2"
        >
          <i :class="link.icon" aria-hidden="true" />
        </button>
      </NuxtLink>
    </template>
    <template #content>
      <NuxtPage />
    </template>
  </WithAsideNav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { ROUTES_NAMES } from '../../locokit-paths'
import WithAsideNav from '../../layouts/WithAsideNav.vue'
import { useStoreWorkspaces } from '../../stores/workspaces'
import {
  ref,
  useHead,
  useRoute,
  onMounted,
  onUnmounted,
  definePageMeta,
} from '#imports'

const { t } = useI18n({ useScope: 'global' })

const route = useRoute()
const workspacesStore = useStoreWorkspaces()
const { currentWorkspace, workspaces, error } = storeToRefs(workspacesStore)
const toast = useToast()
const showWorkspaces = ref(false)

const MINI_NAV = [
  {
    icon: 'bi bi-graph-up',
    routeName: ROUTES_NAMES.WORKSPACE.DASHBOARD,
    nameTK: 'pages.workspace.dashboard',
  },
  {
    icon: 'bi bi-database-fill',
    routeName: ROUTES_NAMES.WORKSPACE.DATASOURCE.HOME,
    nameTK: 'pages.workspace.datasource',
  },
  {
    icon: 'bi bi-gear-fill',
    routeName: ROUTES_NAMES.WORKSPACE.SETTINGS,
    nameTK: 'pages.workspace.settings',
  },
]

// Initialization
await workspacesStore.updateCurrentWorkspace({
  slug: route.params.workspaceSlug as string,
})

if (typeof workspaces.value === 'undefined') {
  await workspacesStore.updateWorkspaces()
}
definePageMeta({
  redirect: {
    name: ROUTES_NAMES.WORKSPACE.DASHBOARD,
  },
})

const closeWorkspaces = () => {
  showWorkspaces.value = false
}

onMounted(() => {
  document.addEventListener('click', closeWorkspaces)
  if (error.value) {
    toast.add({
      severity: 'error',
      summary: t('error.title'),
      detail: t(`${error.value.message}`),
      life: 5000,
    })
  }
})
onUnmounted(() => {
  document.removeEventListener('click', closeWorkspaces)
})

useHead({
  titleTemplate: `${
    currentWorkspace.value
      ? currentWorkspace.value.name
      : t('pages.admin.title')
  } | %s`,
})
</script>

<style scoped>
.mini-nav-link.router-link-active {
  @apply bg-primary-lighten text-primary hover:bg-primary hover:text-white focus:border-primary;
}

.content-main {
  height: calc(100vh - 4rem);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.selected {
  @apply bg-slate-300 text-primary-dark;
}
</style>
