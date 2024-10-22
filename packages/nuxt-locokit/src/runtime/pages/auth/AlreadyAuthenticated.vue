<template>
  <WithHeader>
    <div
      class="max-w-lg h-full flex flex-col flex-wrap md:justify-center md:m-auto mt-8"
    >
      <div class="mb-8">
        <h1 class="text-center">
          {{ $t('locokit.pages.alreadyAuthenticated.title') }}
        </h1>
      </div>
      <div>
        <p class="mb-8">
          {{ $t('locokit.pages.alreadyAuthenticated.message') }}
        </p>
        <div class="flex justify-around">
          <NuxtLink :to="{ name: ROUTES_NAMES.WORKSPACE.WORKSPACES }">
            <PrimeButton
              class="p-button-rounded p-button-secondary"
              :label="$t('locokit.pages.alreadyAuthenticated.workspaceButton')"
              icon="bi bi-person-workspace"
            />
          </NuxtLink>
          <PrimeButton
            class="p-button-rounded p-button-secondary p-button-outlined"
            :label="$t('locokit.pages.alreadyAuthenticated.logoutButton')"
            icon="bi bi-door-open-fill"
            @click="logout"
          />
        </div>
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WithHeader from '../../layouts/WithHeader.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../../locokit-paths'
import { useHead, useRouter } from '#imports'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const authStore = useStoreAuth()

const logout = async () => {
  await authStore.logout()
  await router.push({
    name: ROUTES_NAMES.HOME,
  })
}

useHead({
  titleTemplate: `${t('locokit.pages.alreadyAuthenticated.title')} | %s`,
})
</script>
