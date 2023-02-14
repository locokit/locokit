<template>
  <WithHeader>
    <div
      class="max-w-lg lg:h-full m-auto mt-8 pb-4 px-4 lg:px-0 flex flex-col justify-center"
    >
      <div class="mb-8">
        <h1 class="text-center">
          {{ $t('pages.alreadyAuthenticated.title') }}
        </h1>
      </div>
      <div>
        <p class="mb-8">
          {{ $t('pages.alreadyAuthenticated.message') }}
        </p>
        <div class="flex justify-around">
          <NuxtLink :to="{ name: ROUTES_NAMES.WORKSPACE.HOME }">
            <PrimeButton
              :label="$t('pages.alreadyAuthenticated.workspaceButton')"
              icon="bi bi-person-workspace"
            />
          </NuxtLink>
          <PrimeButton
            :label="$t('pages.alreadyAuthenticated.logoutButton')"
            icon="bi bi-door-open-fill"
            @click="logout"
          />
        </div>
      </div>
    </div>
  </WithHeader>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import WithHeader from '../../layouts/WithHeader.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../../paths'
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
  titleTemplate: `${t('pages.alreadyAuthenticated.title')} | %s`,
})
</script>
