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
          :lost-password-route="ROUTES_PATH.AUTH.LOSTPASSWORD"
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
import { useStoreAuth } from '../../stores/auth'
import { ROUTES_PATH, ROUTES_NAMES } from '../paths'
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
