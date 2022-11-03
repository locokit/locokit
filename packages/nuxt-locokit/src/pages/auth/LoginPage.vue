<template>
  <WithBackground background-image="../../dog.jpg">
    <PrimeCard class="flex-grow p-2 max-w-2xl">
      <template #title>
        <h1 class="text-center">{{ $t('pages.login.title') }}</h1>
      </template>
      <template #content>
        <LoginForm
          :loading="false"
          :error="error"
          :display-sign-up-link="false"
          lost-password-route="lost-password"
          @submit="authenticate"
        />
      </template>
    </PrimeCard>
  </WithBackground>
</template>

<script setup lang="ts">
import PrimeCard from 'primevue/card'
import { LoginForm } from '@locokit/designsystem'
import { storeToRefs } from 'pinia'
import WithBackground from '../../layouts/WithBackground/WithBackground.vue'
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_NAMES } from '../paths'
import { useRouter } from '#imports'

const router = useRouter()
const authStore = useStoreAuth()
const { error } = storeToRefs(authStore)

const authenticate = async (data) => {
  await authStore.authenticate(data)
  if (authStore.isAuthenticated) {
    await router.push({
      name: ROUTES_NAMES.HOME, // Todo: ROUTES.WORKSPACE.HOME,
    })
  }
}
</script>
