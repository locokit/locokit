<template>
  <div class="relative flex flex-col h-screen overflow-hidden">
    <!-- Brand -->
    <div class="w-full bg-primary-lighten h-16 border-b-2 border-primary flex">
      <slot name="header-insert" />

      <div class="flex flex-row w-full justify-end">
        <div
          class="relative flex flex-row justify-center flex-shrink-0 md:space-x-6 md:pr-8 md:flex-row"
        >
          <slot name="header-items" />
          <NuxtLink
            v-if="user.profile === USER_PROFILE.ADMIN"
            class="nav-link self-center"
            tabindex="-1"
            :to="{ name: ROUTES_NAMES.ADMIN.HOME }"
          >
            <button
              type="button"
              class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:border focus:border-primary hidden md:ml-auto md:inline-flex"
            >
              <i class="bi bi-gear-fill mr-1" />
              <span>
                {{ $t('locokit.layouts.withAsideNav.admin') }}
              </span>
            </button>
          </NuxtLink>
          <NuxtLink
            class="nav-link self-center p-2"
            tabindex="-1"
            :to="{ name: ROUTES_NAMES.PROFILE.HOME }"
          >
            <button
              type="button"
              class="items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:border-1 focus:border-primary hidden md:ml-auto md:inline-flex"
            >
              <i class="bi bi-person-circle mr-1" />
              <span>
                {{ $t('locokit.layouts.withAsideNav.profile') }}
              </span>
            </button>
          </NuxtLink>
          <button
            type="button"
            class="self-center items-center justify-center rounded bg-transparent p-2 text-lck hover:bg-primary hover:text-gray-100 focus:border-1 focus:border-primary hidden md:ml-auto md:inline-flex"
            @click="logout"
          >
            <i class="bi bi-door-open-fill mr-1" />
            <span>
              {{ $t('locokit.layouts.withHeader.logout') }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-row h-full">
      <aside
        tabindex="-1"
        class="static flex flex-col flex-shrink-0 focus:outline-none h-full w-14"
      >
        <!-- Mini navigation -->
        <div class="flex flex-row h-full">
          <div class="bg-primary flex flex-col flex-shrink-0 h-full">
            <div class="flex flex-col flex-1 w-14">
              <slot name="mini-navigation-items" />
            </div>
          </div>
        </div>
      </aside>
      <!-- Content -->
      <div class="content-main w-full">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_PROFILE } from '@locokit/definitions'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '../stores/auth'
import { ROUTES_NAMES } from '../locokit-paths'
import { useRouter } from '#imports'

const router = useRouter()
const authStore = useStoreAuth()

const { user } = storeToRefs(authStore)

const logout = async () => {
  await authStore.logout()
  await router.push({
    name: ROUTES_NAMES.HOME,
  })
}
</script>

<style scoped>
.nav-link.router-link-active {
  @apply border-b-secondary border-b-4 font-bold pt-1 rounded;
}

.content-main {
  height: calc(100vh - 4rem);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
