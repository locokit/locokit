<template>
  <WithBackground>
    <PrimeCard class="p-2 min-h-12">
      <template #title>
        <h1 class="text-center">
          {{ $t('pages.alreadyAuthenticated.title') }}
        </h1>
      </template>
      <template #content>
        <div>
          <p class="mb-4">
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
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import PrimeButton from 'primevue/button'
import { useI18n } from 'vue-i18n'
import WithBackground from '../../layouts/WithBackground.vue'
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
