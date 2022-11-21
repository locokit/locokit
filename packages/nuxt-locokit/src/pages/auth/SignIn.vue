<template>
  <WithBackground>
    <PrimeCard class="p-2">
      <template #title>
        <h1 class="text-center">{{ $t('pages.signIn.title') }}</h1>
      </template>
      <template #content>
        <SignInForm
          :loading="false"
          :error="error"
          :display-sign-up-link="false"
          :lost-password-route="ROUTES_PATH.AUTH.LOST_PASSWORD"
          @submit="authenticate"
        />
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { SignInForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import WithBackground from '../../layouts/WithBackground.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_PATH, ROUTES_NAMES } from '../../paths'
import { useHead, useRouter } from '#imports'

const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const authStore = useStoreAuth()

const { error } = storeToRefs(authStore)

const authenticate = async (data: { email: string; password: string }) => {
  await authStore.authenticate(data)
  if (authStore.isAuthenticated) {
    await router.push({
      name: ROUTES_NAMES.WORKSPACE.HOME,
    })
  }
}

useHead({
  titleTemplate: `${t('pages.signIn.title')} | %s`,
})
</script>
